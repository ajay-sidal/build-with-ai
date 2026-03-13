import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { logger } from '@/lib/logger'
import { startSpan } from '@/lib/tracing'
import { captureException, initSentry } from '@/lib/sentry'
// import { Resend } from 'resend'
// import { OrderConfirmationEmail } from '@/components/emails/OrderConfirmationEmail'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
// const resend = new Resend(process.env.RESEND_API_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    logger.error('Stripe webhook signature validation failed', { error: errorMessage })
    captureException(err, { route: 'webhooks/stripe', reason: 'signature' })
    return new NextResponse(`Webhook Error: ${errorMessage}`, { status: 400 })
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
      (event.data.object as Stripe.Checkout.Session).id,
      { expand: ['line_items'] }
    )

    const lineItems = sessionWithLineItems.line_items?.data || []
    const customerEmail = sessionWithLineItems.customer_details?.email
    const amountTotal = sessionWithLineItems.amount_total ?? 0
    const orderId = sessionWithLineItems.id
    const userId = sessionWithLineItems.metadata?.userId
    
    // Check if the order contains any physical products (heuristic)
    const containsPhysicalProduct = lineItems.some(item =>
      (item.description || '').toLowerCase().includes('t-shirt') ||
      (item.description || '').toLowerCase().includes('merchandise')
    );

    // Store the order in the database
    if (userId) {
      try {
        await prisma.order.create({
          data: {
            stripeId: orderId,
            userId: userId,
            amountTotal: amountTotal,
            shippingStatus: containsPhysicalProduct ? 'processing' : 'none',
            items: {
              create: lineItems.map(item => ({
                name: item.description || 'Unknown Item',
                quantity: item.quantity ?? 1,
                price: item.price?.unit_amount ?? 0,
              })),
            },
          },
        })
        console.log(`Order ${orderId} for user ${userId} stored in database.`)
      } catch (error) {
        logger.error('Database order creation error', { error })
        captureException(error, { orderId, userId })
        // Do not block webhook response for DB errors, but log it
      }
    }

    // Email sending temporarily disabled
    // if (customerEmail && resend) {
    //   try {
    //     await resend.emails.send({
    //       from: 'BUILD WITH AI <noreply@yourdomain.com>',
    //       to: customerEmail,
    //       subject: `Your BUILD WITH AI Order Confirmation #${orderId.substring(0, 8)}`,
    //       react: OrderConfirmationEmail({
    //         customerEmail,
    //         orderTotal: amountTotal / 100,
    //         orderId: orderId,
    //         orderItems: lineItems.map(item => ({
    //           name: item.description,
    //           price: (item.price?.unit_amount ?? 0) / 100,
    //           quantity: item.quantity ?? 1,
    //         }))
    //       }),
    //     })
    //     console.log(`Confirmation email sent to ${customerEmail}`)
    //   } catch (error) {
    //     console.error('Email sending error:', error)
    //   }
    // }
  } else {
    console.warn(`Unhandled event type: ${event.type}`)
  }

  // Initialize Sentry in case not initialized elsewhere
  try {
    initSentry()
  } catch {
    // ignore
  }

  // Return a 200 response to acknowledge receipt of the event
  return new NextResponse(null, { status: 200 })
}