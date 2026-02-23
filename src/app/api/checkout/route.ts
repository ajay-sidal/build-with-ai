import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { allProducts } from '@/lib/openprovider-products'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

interface CartPayloadItem {
  id: string
  quantity: number
}

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return new NextResponse('Stripe secret key not configured.', { status: 500 })
  }

  try {
    const userSession = await getServerSession(authOptions)
    const userEmail = userSession?.user?.email

    const { cartItems: clientCartItems } = (await req.json()) as { cartItems: CartPayloadItem[] }

    if (!clientCartItems || clientCartItems.length === 0) {
      return new NextResponse('No items in cart.', { status: 400 })
    }

    // Harden the process by fetching prices and details on the server
    const line_items = clientCartItems.map((item) => {
      const product = allProducts.find((p) => p.id === item.id)
      if (!product) {
        throw new Error(`Product with ID ${item.id} not found.`)
      }

      const price = parseFloat(product.pricing?.startingFrom || '0')
      if (isNaN(price) || price <= 0) {
        throw new Error(`Invalid price for product: ${product.name}`)
      }

      return {
        price_data: {
          currency: product.pricing?.currency.toLowerCase() || 'usd',
          product_data: {
            name: product.name,
            description: product.description,
            metadata: {
              // Pass internal product ID for reconciliation
              productId: product.id,
            }
          },
          unit_amount: Math.round(price * 100), // Stripe expects amount in cents
        },
        quantity: item.quantity,
      }
    })

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      customer_email: userEmail || undefined, // Pre-fill the user's email
      mode: 'payment',
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel`,
      metadata: {
        // Pass the user's database ID to the webhook
        userId: (userSession?.user as any)?.id || '',
        cart: JSON.stringify(clientCartItems.map(item => item.id)),
      }
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('[STRIPE API Error]:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new NextResponse(`Failed to create Stripe session: ${errorMessage}`, { status: 500 })
  }
}