import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { AFFILIATE_COOKIE_NAME, parseCookieHeader } from '../../../../utils/affiliate'

export const runtime = 'nodejs'

type TemplateSku = 'nextjs-ai-boilerplates' | 'tailwind-pro-ui-kits'

type RequestBody = {
  sku: TemplateSku
}

const PRODUCTS: Record<TemplateSku, { name: string; amountUsd: number }> = {
  'nextjs-ai-boilerplates': { name: 'Next.js AI Boilerplates', amountUsd: 149 },
  'tailwind-pro-ui-kits': { name: 'Tailwind Pro UI Kits', amountUsd: 99 },
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as RequestBody | null
  const sku = body?.sku
  if (!sku || !(sku in PRODUCTS)) return NextResponse.json({ error: 'Invalid sku' }, { status: 400 })

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) return NextResponse.json({ error: 'Missing STRIPE_SECRET_KEY' }, { status: 500 })

  const stripe = new Stripe(secretKey)

  try {
    const origin = req.headers.get('origin') || 'http://localhost:3000'
    const product = PRODUCTS[sku]
    const cookies = parseCookieHeader(req.headers.get('cookie'))
    const partnerId = cookies[AFFILIATE_COOKIE_NAME] || ''
    const amountUsd = Math.round(product.amountUsd * 100) / 100

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: `${origin}/products/templates?checkout=success&sku=${encodeURIComponent(sku)}`,
      cancel_url: `${origin}/products/templates?checkout=cancelled&sku=${encodeURIComponent(sku)}`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(product.amountUsd * 100),
            product_data: { name: product.name },
          },
        },
      ],
      metadata: {
        kind: 'template',
        sku,
        partner_id: partnerId,
        currency: 'USD',
        customer_amount: String(amountUsd),
        markup_amount: String(amountUsd),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Checkout failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
