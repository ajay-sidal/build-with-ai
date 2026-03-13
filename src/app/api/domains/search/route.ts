import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { opClient } from '../../../../lib/openprovider'
import { calculateCustomerPrice } from '../../../../utils/pricing'
import { getHotTlds } from '../../../../lib/promoStore'
import { getCurrentUserTier } from '../../../../lib/entitlements'
import { z } from 'zod'

export const runtime = 'nodejs'

// Input validation schema
const SearchQuerySchema = z.object({
  query: z.string().min(1).max(100).trim(),
})

type RequestBody = z.infer<typeof SearchQuerySchema>

function normalizeSearchLabel(raw: string): string {
  const q = (raw || '').trim()
  if (!q) return ''

  // Heuristic: if sentence contains "called" or "named", take the following label token.
  // This avoids false quote detection for contractions like "I'm".
  const called = q.match(/\b(?:called|named)\b\s+(?:a|an|the)?\s*["“”‘’]?([\p{L}\p{N}][\p{L}\p{N}\-]{1,62})/iu)
  const calledWord = (called?.[1] || '').trim()

  // Prefer text inside *double* quotes if present (less likely to conflict with contractions).
  const quoteMatch = q.match(/["“”]([^"“”]{1,80})["“”]/)
  const fromQuotes = (quoteMatch?.[1] || '').trim()

  const base = calledWord || fromQuotes || q

  // Extract last token-ish word
  const tokens = base
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\-\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)

  const last = tokens[tokens.length - 1] || ''
  const cleaned = last
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 63)

  return cleaned || q.replace(/\s+/g, '').slice(0, 63)
}

function pickPublicWarning(warnings: string[], resultsCount: number): string | undefined {
  const safe = warnings
    .map((w) => (w || '').trim())
    .filter(Boolean)

  // If we still have results, avoid showing provider-internal/transient errors.
  if (resultsCount > 0) {
    const pricing = safe.find((w) => w.toLowerCase().includes('pricing temporarily unavailable'))
    return pricing || undefined
  }

  // No results: show something actionable.
  const providerDown = safe.find((w) => w.toLowerCase().includes('temporarily unavailable'))
  return providerDown || safe[0]
}

function toDomainParts(domain: string): { name: string; extension: string } | null {
  const trimmed = domain.trim().toLowerCase()
  if (!trimmed.includes('.')) return null
  const parts = trimmed.split('.').filter(Boolean)
  if (parts.length < 2) return null
  return {
    name: parts.slice(0, -1).join('.'),
    extension: parts[parts.length - 1]!,
  }
}

function roundMoney(amount: number) {
  return Math.round(amount * 100) / 100
}

export async function POST(req: Request) {
  const requestId = randomUUID()
  
  // Parse and validate request body
  const body = await req.json().catch(() => null)
  const parsed = SearchQuerySchema.safeParse(body)
  
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: parsed.error.issues, requestId },
      { status: 400, headers: { 'x-request-id': requestId } }
    )
  }
  
  const query = parsed.data.query

  const tlds = ['com', 'digital', 'ai', 'app', 'tech', 'blog', 'biz', 'horse', 'me']

  const searchName = normalizeSearchLabel(query)
  const userTier = await getCurrentUserTier()

  try {
    const hotTlds = await getHotTlds().catch(() => new Set<string>())

    const warnings: string[] = []

    // Step 1: run suggestion + base checks in parallel
    const [suggestions, baseChecks] = await Promise.all([
      opClient.suggestNames(searchName, 10, tlds).catch((err) => {
        const message = err instanceof Error ? err.message : 'Suggestion lookup failed'
        warnings.push(message)
        return [] as { domain: string }[]
      }),
      opClient.checkDomains(searchName, tlds, true).catch(async (err) => {
        const message = err instanceof Error ? err.message : 'Availability lookup failed'
        warnings.push(message)

        // Fallback: availability without price.
        try {
          warnings.push('Pricing temporarily unavailable; returning availability only')
          return await opClient.checkDomains(searchName, tlds, false)
        } catch {
          return [] as any[]
        }
      }),
    ])

    // Step 2: check suggested domains (deduped)
    const suggestedDomainParts = Array.from(
      new Map(
        suggestions
          .map((s) => toDomainParts(s.domain))
          .filter((x): x is { name: string; extension: string } => Boolean(x))
          .map((p) => [`${p.name}.${p.extension}`, p] as const),
      ).values(),
    )

    const suggestedChecks =
      suggestedDomainParts.length > 0
        ? await opClient.checkDomains(suggestedDomainParts, true).catch(async (err) => {
            const message = err instanceof Error ? err.message : 'Suggested availability lookup failed'
            warnings.push(message)

            // Fallback: suggested availability without price.
            try {
              warnings.push('Pricing temporarily unavailable for suggestions; returning availability only')
              return await opClient.checkDomains(suggestedDomainParts, false)
            } catch {
              return [] as any[]
            }
          })
        : []

    const merged = new Map<string, typeof baseChecks[number]>()
    for (const r of [...baseChecks, ...suggestedChecks]) {
      const d = (r as any)?.domain
      if (typeof d !== 'string' || !d.includes('.')) continue
      merged.set(d, r)
    }

    const results = Array.from(merged.values())
      .map((r) => {
        if (typeof (r as any)?.domain !== 'string') return r
        if (!r.price) return r
        const amount = (r.price as any)?.amount
        if (typeof amount !== 'number' || !Number.isFinite(amount)) return { ...r, resellerPrice: r.price }

        const resellerPrice = r.price
        const tld = String(r.domain.split('.').pop() || '').toLowerCase()
        return {
          ...r,
          resellerPrice,
          isHot: hotTlds.has(tld),
          price: {
            currency: r.price.currency,
            amount: roundMoney(calculateCustomerPrice(amount, 'DOMAIN', { userTier })),
          },
        }
      })
      .sort((a, b) => (a.domain > b.domain ? 1 : -1))

    const publicWarning = pickPublicWarning(warnings, results.length)

    if (results.length === 0 && publicWarning) {
      // Provider was reachable but couldn't return usable data.
      return NextResponse.json(
        { query, results: [], warning: publicWarning, requestId },
        { status: 503, headers: { 'x-request-id': requestId } },
      )
    }

    return NextResponse.json(
      { query, results, warning: publicWarning, requestId },
      { headers: { 'x-request-id': requestId } },
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Domain search failed'
    console.error('[domains/search]', { requestId, message })
    return NextResponse.json({ error: message, requestId }, { status: 500, headers: { 'x-request-id': requestId } })
  }
}
