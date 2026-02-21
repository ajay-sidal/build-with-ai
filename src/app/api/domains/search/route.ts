import { NextResponse } from 'next/server'
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
  const body = (await req.json().catch(() => null)) as RequestBody | null
  const query = body?.query?.trim()

  if (!query) {
    return NextResponse.json({ error: 'Missing query' }, { status: 400 })
  }

  const tlds = ['com', 'digital', 'ai', 'app', 'tech', 'blog', 'biz', 'horse', 'me']

  const cookies = parseCookieHeader(req.headers.get('cookie'))
  const userTier = normalizeUserTier(cookies[USER_TIER_COOKIE])

  try {
    const hotTlds = await getHotTlds().catch(() => new Set<string>())

    // Step 1: run suggestion + base checks in parallel
    const [suggestions, baseChecks] = await Promise.all([
      opClient.suggestNames(query, 10, tlds),
      opClient.checkDomains(query, tlds, true),
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
      suggestedDomainParts.length > 0 ? await opClient.checkDomains(suggestedDomainParts, true) : []

    const merged = new Map<string, typeof baseChecks[number]>()
    for (const r of [...baseChecks, ...suggestedChecks]) merged.set(r.domain, r)

    const results = Array.from(merged.values())
      .map((r) => {
        if (!r.price) return r
        const resellerPrice = r.price
        const tld = String(r.domain.split('.').pop() || '').toLowerCase()
        return {
          ...r,
          resellerPrice,
          isHot: hotTlds.has(tld),
          price: {
            currency: r.price.currency,
            amount: roundMoney(calculateCustomerPrice(r.price.amount, 'DOMAIN', { userTier })),
          },
        }
      })
      .sort((a, b) => (a.domain > b.domain ? 1 : -1))

    return NextResponse.json({ query, results })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Domain search failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
