import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { opClient } from '../../../../lib/openprovider'
import { calculateCustomerPrice } from '../../../../utils/pricing'
import { parseCookieHeader } from '../../../../utils/affiliate'
import { normalizeUserTier, USER_TIER_COOKIE } from '../../../../utils/membership'
import { getHotTlds } from '../../../../lib/promoStore'

export const runtime = 'nodejs'

type RequestBody = {
  query: string
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
  const body = (await req.json().catch(() => null)) as RequestBody | null
  const query = body?.query?.trim()

  if (!query) {
    return NextResponse.json({ error: 'Missing query', requestId }, { status: 400, headers: { 'x-request-id': requestId } })
  }

  const tlds = ['com', 'digital', 'ai', 'app', 'tech', 'blog', 'biz', 'horse', 'me']

  const cookies = parseCookieHeader(req.headers.get('cookie'))
  const userTier = normalizeUserTier(cookies[USER_TIER_COOKIE])

  try {
    const hotTlds = await getHotTlds().catch(() => new Set<string>())

    const warnings: string[] = []

    // Step 1: run suggestion + base checks in parallel
    const [suggestions, baseChecks] = await Promise.all([
      opClient.suggestNames(query, 10, tlds).catch((err) => {
        const message = err instanceof Error ? err.message : 'Suggestion lookup failed'
        warnings.push(message)
        return [] as { domain: string }[]
      }),
      opClient.checkDomains(query, tlds, true).catch((err) => {
        const message = err instanceof Error ? err.message : 'Availability lookup failed'
        warnings.push(message)
        return [] as any[]
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
        ? await opClient.checkDomains(suggestedDomainParts, true).catch((err) => {
            const message = err instanceof Error ? err.message : 'Suggested availability lookup failed'
            warnings.push(message)
            return [] as any[]
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

    if (results.length === 0 && warnings.length > 0) {
      // Provider was reachable but couldn't return usable data.
      return NextResponse.json(
        { query, results: [], warning: warnings[0], requestId },
        { status: 503, headers: { 'x-request-id': requestId } },
      )
    }

    return NextResponse.json(
      { query, results, warning: warnings.length > 0 ? warnings[0] : undefined, requestId },
      { headers: { 'x-request-id': requestId } },
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Domain search failed'
    console.error('[domains/search]', { requestId, message })
    return NextResponse.json({ error: message, requestId }, { status: 500, headers: { 'x-request-id': requestId } })
  }
}
