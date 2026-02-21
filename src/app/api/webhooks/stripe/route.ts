import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { opClient } from '../../../../lib/openprovider'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!secretKey) return NextResponse.json({ error: 'Missing STRIPE_SECRET_KEY' }, { status: 500 })
  if (!webhookSecret) return NextResponse.json({ error: 'Missing STRIPE_WEBHOOK_SECRET' }, { status: 500 })

  const stripe = new Stripe(secretKey)

  const sig = req.headers.get('stripe-signature')
  if (!sig) return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })

  const rawBody = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid webhook signature'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const md = session.metadata || {}

    const domainName = md.domain_name
    const tld = md.tld
    const ownerHandle = md.owner_handle

    if (domainName && tld && ownerHandle) {
      const fqdn = md.fqdn || `${domainName}.${tld}`

      // Requirement: call createDomain() AND createDnsZone() using metadata.
      // Disable auto-DNS on createDomain to avoid double provisioning.
      await opClient.createDomain(
        {
          domain: { name: domainName, extension: tld },
          owner_handle: ownerHandle,
          admin_handle: ownerHandle,
          tech_handle: ownerHandle,
          billing_handle: ownerHandle,
          period: 1,
        },
        { provisionDnsZone: false },
      )

      await opClient.createDnsZone({ domain: fqdn, type: 'master' })
    }
  }

  return NextResponse.json({ received: true })
}
