import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { calculateCustomerPrice } from '../../../utils/pricing'

export const runtime = 'nodejs'

type Money = { currency: string; amount: number }

type DomainCartItem = {
  kind: 'domain'
  domain: string
  name: string
  tld: string
  owner_handle: string
  resellerPrice: Money
}

type SslCartItem = {
  kind: 'ssl'
  product_id: string | number
  period: number
  resellerPrice: Money
}

type RequestBody = {
  cart: DomainCartItem | SslCartItem
}

function roundMoney(amount: number) {
  return Math.round(amount * 100) / 100
}

function toStripeUnitAmount(currency: string, amount: number) {
  // Keep it simple; most currencies are 2 decimals. If you need JPY/etc, extend this.
  const unitAmount = Math.round(amount * 100)
  if (!Number.isFinite(unitAmount) || unitAmount <= 0) throw new Error('Invalid amount')
  return unitAmount
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as RequestBody | null
  if (!body?.cart) return NextResponse.json({ error: 'Missing cart' }, { status: 400 })

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) return NextResponse.json({ error: 'Missing STRIPE_SECRET_KEY' }, { status: 500 })

  const stripe = new Stripe(secretKey)

  try {
    const origin = req.headers.get('origin') || 'http://localhost:3000'

    if (body.cart.kind === 'domain') {
      const item = body.cart
      const currency = item.resellerPrice.currency
      const finalAmount = roundMoney(calculateCustomerPrice(item.resellerPrice.amount, 'DOMAIN'))

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        success_url: `${origin}/?checkout=success&domain=${encodeURIComponent(item.domain)}`,
        cancel_url: `${origin}/?checkout=cancelled&domain=${encodeURIComponent(item.domain)}`,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: currency.toLowerCase(),
              unit_amount: toStripeUnitAmount(currency, finalAmount),
              product_data: {
                name: `Domain registration: ${item.domain}`,
              },
            },
          },
        ],
        metadata: {
          domain_name: item.name,
          tld: item.tld,
          owner_handle: item.owner_handle,
          fqdn: item.domain,
        },
      })

      return NextResponse.json({ url: session.url })
    }

    // SSL cart: session + metadata (provisioning handled elsewhere)
    const item = body.cart
    const currency = item.resellerPrice.currency
    const finalAmount = roundMoney(calculateCustomerPrice(item.resellerPrice.amount, 'SSL'))

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: `${origin}/ssl?checkout=success`,
      cancel_url: `${origin}/ssl?checkout=cancelled`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: currency.toLowerCase(),
            unit_amount: toStripeUnitAmount(currency, finalAmount),
            product_data: {
              name: `SSL order: ${String(item.product_id)}`,
            },
          },
        },
      ],
      metadata: {
        kind: 'ssl',
        product_id: String(item.product_id),
        period: String(item.period),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Checkout failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
