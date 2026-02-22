import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { calculateCustomerPrice } from '../../../utils/pricing'
import { AFFILIATE_COOKIE_NAME, parseCookieHeader } from '../../../utils/affiliate'
import { applyDiscountToCustomerPrice } from '../../../utils/discounts'
import { dbRateLimit } from '../../../lib/opsStore'
import { randomUUID } from 'node:crypto'
import { getCurrentUserTier } from '../../../lib/entitlements'
import { z } from 'zod'

export const runtime = 'nodejs'

// Money schema for reuse
const MoneySchema = z.object({
  currency: z.string().min(1).max(3),
  amount: z.number().positive(),
})

// Cart item schemas
const DomainCartItemSchema = z.object({
  kind: z.literal('domain'),
  domain: z.string().min(1).max(253),
  name: z.string().min(1).max(63),
  tld: z.string().min(1).max(20),
  owner_handle: z.string().min(1).max(20),
  resellerPrice: MoneySchema,
})

const SslCartItemSchema = z.object({
  kind: z.literal('ssl'),
  product_id: z.union([z.string(), z.number()]),
  period: z.number().positive(),
  resellerPrice: MoneySchema,
})

const CartItemSchema = z.discriminatedUnion('kind', [
  DomainCartItemSchema,
  SslCartItemSchema,
])

// Request body schema
const CheckoutRequestSchema = z.object({
  cart: CartItemSchema,
  discountCode: z.string().max(20).optional(),
})

type RequestBody = z.infer<typeof CheckoutRequestSchema>

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
  const requestId = randomUUID()
  // Basic rate limit (per-IP-ish). Fail open if DB unavailable.
  try {
    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0]?.trim() || 'unknown'
    const rl = await dbRateLimit({ key: `checkout:${ip}`, limit: 30, windowSeconds: 60 })
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'x-request-id': requestId } })
    }
  } catch {
    // ignore
  }

  // Parse and validate request body
  const body = await req.json().catch(() => null)
  const parsed = CheckoutRequestSchema.safeParse(body)
  
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: parsed.error.errors },
      { status: 400, headers: { 'x-request-id': requestId } }
    )
  }

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) return NextResponse.json({ error: 'Missing STRIPE_SECRET_KEY' }, { status: 500 })

  const stripe = new Stripe(secretKey)

  try {
    const origin = req.headers.get('origin') || 'http://localhost:3000'
    const cookies = parseCookieHeader(req.headers.get('cookie'))
    const partnerId = cookies[AFFILIATE_COOKIE_NAME] || ''
    const userTier = await getCurrentUserTier()
    const discountCode = (parsed.data.discountCode || '').toString().trim().toUpperCase()

    if (parsed.data.cart.kind === 'domain') {
      const item = parsed.data.cart
      const currency = item.resellerPrice.currency
      const originalCustomerAmount = roundMoney(
        calculateCustomerPrice(item.resellerPrice.amount, 'DOMAIN', { userTier }),
      )
      const resellerAmount = roundMoney(item.resellerPrice.amount)

      const baseDiscounted = applyDiscountToCustomerPrice({
        customerPrice: originalCustomerAmount,
        resellerPrice: resellerAmount,
        code: discountCode,
      })

      // Marketing hook: share unlocks "$5 .digital" (never below reseller price).
      const isDigital = (item.tld || '').toString().trim().toLowerCase() === 'digital'
      const discountedCustomerAmount = (() => {
        if (discountCode === 'ALPHA50' && isDigital) return roundMoney(Math.max(resellerAmount, 5.0))
        return baseDiscounted.customerPrice
      })()

      const finalAmount = discountedCustomerAmount
      const originalMarkup = roundMoney(Math.max(0, originalCustomerAmount - resellerAmount))

      const metadata: Record<string, string> = {
        kind: 'domain',
        domain_name: item.name,
        tld: item.tld,
        owner_handle: item.owner_handle,
        fqdn: item.domain,
        partner_id: partnerId,
        currency,
        reseller_amount: String(resellerAmount),
        customer_amount: String(finalAmount),
        original_customer_amount: String(originalCustomerAmount),
        markup_amount: String(originalMarkup),
      }

      if (discountCode) metadata.discount_code = discountCode

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
        metadata,
      })

      return NextResponse.json({ url: session.url }, { headers: { 'x-request-id': requestId } })
    }

    // SSL cart: session + metadata (provisioning handled elsewhere)
    const item = parsed.data.cart
    const currency = item.resellerPrice.currency
    const originalCustomerAmount = roundMoney(calculateCustomerPrice(item.resellerPrice.amount, 'SSL'))
    const resellerAmount = roundMoney(item.resellerPrice.amount)

    const discounted = applyDiscountToCustomerPrice({
      customerPrice: originalCustomerAmount,
      resellerPrice: resellerAmount,
      code: discountCode,
    })

    const finalAmount = discounted.customerPrice
    const originalMarkup = roundMoney(Math.max(0, originalCustomerAmount - resellerAmount))

    const metadata: Record<string, string> = {
      kind: 'ssl',
      product_id: String(item.product_id),
      period: String(item.period),
      partner_id: partnerId,
      currency,
      reseller_amount: String(resellerAmount),
      customer_amount: String(finalAmount),
      original_customer_amount: String(originalCustomerAmount),
      markup_amount: String(originalMarkup),
    }

    if (discountCode) metadata.discount_code = discountCode

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
      metadata,
    })

    return NextResponse.json({ url: session.url }, { headers: { 'x-request-id': requestId } })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Checkout failed'
    return NextResponse.json({ error: message }, { status: 500, headers: { 'x-request-id': requestId } })
  }
}
