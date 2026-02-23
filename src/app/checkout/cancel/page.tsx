'use client'

import { useCart } from '@/components/providers/CartProvider'
import Link from 'next/link'
import { ArrowRight, Lock } from 'lucide-react'
import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'

// Load the Stripe.js script
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
  const { cartItems, itemCount } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const subtotal = cartItems.reduce((total, item) => {
    const price = parseFloat(item.pricing?.startingFrom || '0')
    return total + price * item.quantity
  }, 0)

  const handleCheckout = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const cartPayload = cartItems.map(item => ({ id: item.id, quantity: item.quantity }))

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItems: cartPayload }),
      })

      const { sessionId, error: apiError } = await response.json()

      if (!response.ok || apiError) {
        throw new Error(apiError || 'Failed to create checkout session.')
      }

      const stripe = await stripePromise
      if (!stripe) {
        throw new Error('Stripe.js failed to load.')
      }

      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId })

      if (stripeError) {
        throw new Error(stripeError.message)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.'
      console.error('Checkout error:', message)
      setError(message)
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <Lock className="h-8 w-8 text-blue-400" />
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Secure Checkout</h1>
      </div>

      <div className="mt-12">
        {itemCount === 0 ? (
          <div className="text-center py-16 rounded-lg border-2 border-dashed border-zinc-800">
            <p className="text-zinc-400">Your cart is empty.</p>
            <Link href="/products" className="mt-4 inline-block font-medium text-blue-400 hover:text-blue-300">
              Start by adding some products &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Order Summary */}
            <div>
              <h2 className="text-xl font-medium text-white">Order summary</h2>
              <ul role="list" className="mt-6 divide-y divide-zinc-800 border-b border-t border-zinc-800">
                {cartItems.map((product) => (
                  <li key={product.id} className="flex py-4">
                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-white">
                          <h3>{product.name}</h3>
                          <p className="ml-4">${(parseFloat(product.pricing?.startingFrom || '0') * product.quantity).toFixed(2)}</p>
                        </div>
                        <p className="mt-1 text-sm text-zinc-400">Qty: {product.quantity}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center justify-between text-lg font-medium text-white">
                <p>Total</p>
                <p>${subtotal.toFixed(2)}</p>
              </div>
            </div>

            {/* Payment Details */}
            <div className="rounded-lg bg-zinc-900 px-4 py-6 sm:p-6 lg:p-8">
              <h2 className="text-xl font-medium text-white">Payment</h2>
              <p className="mt-4 text-zinc-400">You will be redirected to our secure payment partner, Stripe, to complete your purchase.</p>
              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="mt-8 flex w-full items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? 'Processing...' : 'Proceed to Payment'}
                {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
              </button>
              {error && <p className="mt-4 text-sm text-red-400">Error: {error}</p>}
              <p className="mt-4 text-xs text-zinc-500 text-center">
                All transactions are secure and encrypted.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}