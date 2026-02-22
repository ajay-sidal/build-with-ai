import { NextResponse } from 'next/server'
import { opClient } from '../../../../../lib/openprovider'
import { calculateCustomerPrice } from '../../../../../utils/pricing'
import { requireDeveloperKey } from '../../../../../lib/developerApiAuth'

export const runtime = 'nodejs'

function roundMoney(amount: number) {
  return Math.round(amount * 100) / 100
}

export async function GET(req: Request) {
  const auth = await requireDeveloperKey(req)
  if (!auth.ok) return auth.res

  const url = new URL(req.url)
  const query = (url.searchParams.get('query') || url.searchParams.get('q') || '').trim()
  const tldsParam = (url.searchParams.get('tlds') || '').trim()

  if (!query) {
    return NextResponse.json(
      { error: 'Missing query', requestId: auth.ctx.requestId },
      { status: 400, headers: { 'x-request-id': auth.ctx.requestId, powered_by: 'BuildWithAI.digital' } },
    )
  }

  const tlds = tldsParam
    ? tldsParam
        .split(',')
        .map((t) => t.trim().replace(/^\./, '').toLowerCase())
        .filter(Boolean)
        .slice(0, 50)
    : ['com', 'digital', 'ai', 'app', 'tech', 'blog', 'biz', 'horse', 'me']

  try {
    const results = await opClient.checkDomains(query, tlds, true).catch(async () => {
      // Fallback: availability without price.
      return await opClient.checkDomains(query, tlds, false)
    })

    const priced = (results || []).map((r) => {
      if (!r?.price) return r
      return {
        ...r,
        resellerPrice: r.price,
        price: {
          currency: r.price.currency,
          amount: roundMoney(calculateCustomerPrice(r.price.amount, 'DOMAIN', { userTier: 'AI_EXPLORER' })),
        },
      }
    })

    return NextResponse.json(
      { query, results: priced, requestId: auth.ctx.requestId },
      { headers: { 'x-request-id': auth.ctx.requestId, powered_by: 'BuildWithAI.digital' } },
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Domain check failed'
    return NextResponse.json(
      { error: message, requestId: auth.ctx.requestId },
      { status: 502, headers: { 'x-request-id': auth.ctx.requestId, powered_by: 'BuildWithAI.digital' } },
    )
  }
}
