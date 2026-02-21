import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { AFFILIATE_COOKIE_NAME, parseCookieHeader } from '../../../../utils/affiliate'
import { getDataDir } from '../../../../lib/dataDir'

export const runtime = 'nodejs'

type ProposalScope = {
  aiDesign?: boolean
  domain?: { fqdn: string; resellerPrice: number }
  ssl?: { resellerPrice: number }
}

type ProposalRecord = {
  clientName: string
  email?: string
  scope: ProposalScope
  depositAmount?: number
  totalPrice?: number
}

type ProposalsFile = Record<string, ProposalRecord>

type RequestBody = {
  slug: string
}

async function loadProposal(slug: string): Promise<ProposalRecord | null> {
  const dataDir = getDataDir()
  const paths = [join(dataDir, 'proposals.json'), join(dataDir, 'proposals.sample.json')]

  for (const p of paths) {
    const text = await readFile(p, { encoding: 'utf8' }).catch((err: any) => {
      if (err?.code === 'ENOENT') return null
      throw err
    })
    if (!text) continue
    try {
      const json = JSON.parse(text) as ProposalsFile
      if (json && json[slug]) return json[slug]!
    } catch {
      // ignore
    }
  }

  return null
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as RequestBody | null
  const slug = body?.slug?.trim()
  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 })

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) return NextResponse.json({ error: 'Missing STRIPE_SECRET_KEY' }, { status: 500 })

  const stripe = new Stripe(secretKey)

  try {
    const origin = req.headers.get('origin') || 'http://localhost:3000'
    const cookies = parseCookieHeader(req.headers.get('cookie'))
    const partnerId = cookies[AFFILIATE_COOKIE_NAME] || ''
    const proposal = await loadProposal(slug)

    const clientName = proposal?.clientName || slug
    const email = proposal?.email || ''

    const deposit = 999

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: `${origin}/proposal/${encodeURIComponent(slug)}?paid=success`,
      cancel_url: `${origin}/proposal/${encodeURIComponent(slug)}?paid=cancelled`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: deposit * 100,
            product_data: { name: `AI Design Deposit — ${clientName}` },
          },
        },
      ],
      metadata: {
        payment_type: 'SERVICE_DEPOSIT',
        proposal_slug: slug,
        lead_name: clientName,
        lead_email: email,
        deposit_amount: String(deposit),
        partner_id: partnerId,
        currency: 'USD',
        customer_amount: String(deposit),
        markup_amount: String(deposit),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Checkout failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
