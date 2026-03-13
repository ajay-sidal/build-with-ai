import { NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { opClient } from '../../../../lib/openprovider'
import { upsertTldPromo, listTldPromos } from '../../../../lib/promoStore'
import { dbAudit } from '../../../../lib/opsStore'

export const runtime = 'nodejs'

function isAuthed(req: Request): boolean {
  const adminSecret = (process.env.ADMIN_SECRET || '').trim()
  if (!adminSecret) return false
  const headerSecret = req.headers.get('x-admin-secret') || req.headers.get('authorization')
  return Boolean(headerSecret && headerSecret === adminSecret)
}

export async function GET(req: Request) {
  const requestId = randomUUID()
  if (!isAuthed(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: { 'x-request-id': requestId } })
  }

  // Heuristic promo sync:
  // OpenProvider "with_price" gives reseller pricing. We treat very-low first-year prices as a promotion.
  // This avoids relying on undocumented endpoints and still lets us automatically flag HOT TLDs.
  const candidateTlds = [
    'blog',
    'horse',
    'biz',
    'digital',
    'ai',
    'me',
    'app',
    'tech',
    'store',
  ]

  const probeName = `promo${String(Date.now()).slice(-6)}`

  try {
    const res = await opClient.checkDomains(probeName, candidateTlds, true)

    let updated = 0
    for (const r of res) {
      const tld = String(r.domain.split('.').pop() || '').toLowerCase()
      const currency = (r.price?.currency || '').toUpperCase() || null
      const resellerAmount = typeof r.price?.amount === 'number' ? r.price.amount : null

      // Mark HOT if reseller amount is low enough to indicate a promo (common wholesale promos are ~$2.99).
      const isHot = resellerAmount != null && resellerAmount <= 3.0

      if (tld) {
        await upsertTldPromo({ tld, isHot, resellerAmount, currency })
        updated++
      }
    }

    try {
      const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0]?.trim() || 'unknown'
      await dbAudit({
        actorType: 'admin',
        actorId: 'admin',
        action: 'sync_promos',
        resource: 'tld_promos',
        resourceId: 'all',
        metadata: { updated, ip },
      })
    } catch {
      // ignore
    }

    const promos = await listTldPromos()
    return NextResponse.json({ ok: true, updated, promos }, { headers: { 'x-request-id': requestId } })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Promo sync failed'
    return NextResponse.json({ error: message }, { status: 500, headers: { 'x-request-id': requestId } })
  }
}
