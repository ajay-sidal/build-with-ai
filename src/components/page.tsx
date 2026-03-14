'use client'

import { useCart } from '@/components/providers/CartProvider'
import Link from 'next/link'
import { Button } from './ui/button'
import { ArrowRight, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react'

export default function CartPage() {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, itemCount } = useCart()

  const subtotal = cartItems.reduce((total, item) => {
    const price = parseFloat(item.pricing?.startingFrom || '0')
    return total + price * item.quantity
  }, 0)

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to remove all items from your cart? This action cannot be undone.')) {
      clearCart()
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <ShoppingCart className="h-8 w-8 text-blue-400" />
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Shopping Cart</h1>
      </div>

      <div className="mt-12">
        {itemCount === 0 ? (
          <div className="text-center py-16 rounded-lg border-2 border-dashed border-zinc-800">
            <p className="text-zinc-400">Your cart is empty.</p>
            <Link href="/products" className="mt-4 inline-block font-medium text-blue-400 hover:text-blue-300">
              Browse products &rarr;
            </Link>
          </div>
        ) : (
          <section aria-labelledby="cart-heading">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul role="list" className="divide-y divide-zinc-800 border-b border-t border-zinc-800">
              {cartItems.map((product) => (
                <li key={product.id} className="flex py-6">
                  <div className="flex-shrink-0">
                    <div className="flex h-24 w-24 items-center justify-center rounded-md bg-zinc-800 text-blue-400">
                      {/* Placeholder for product icon */}
                      <span className="text-3xl">🛍️</span>
                    </div>
                  </div>

                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-white">
                        <h3>
                          <Link href={`/products/${product.slug}`}>{product.name}</Link>
                        </h3>
                        <p className="ml-4">${product.pricing?.startingFrom}</p>
                      </div>
                      <p className="mt-1 text-sm text-zinc-400">{product.category}</p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <div className="flex items-center border border-zinc-700 rounded-md">
                        <Button
                          variant="secondary"
                          onClick={() => decreaseQuantity(product.id)}
                          className="px-2 py-1 text-zinc-400 rounded-l-md"
                          aria-label={`Decrease quantity of ${product.name}`}
                        >
                          <Minus size={16} />
                        </Button>
                        <p className="px-3 text-zinc-300" aria-live="polite">{product.quantity}</p>
                        <Button
                          variant="secondary"
                          onClick={() => increaseQuantity(product.id)}
                          className="px-2 py-1 text-zinc-400 rounded-r-md"
                          aria-label={`Increase quantity of ${product.name}`}
                        >
                          <Plus size={16} />
                        </Button>
                      </div>
                      <div className="flex">
                        <Button type="button" variant="secondary" onClick={() => removeFromCart(product.id)} className="font-medium text-red-500 hover:text-red-400">
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex justify-end">
              <Button onClick={handleClearCart} variant="secondary" className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-red-400 transition-colors">
                <Trash2 size={16} />
                Clear Cart
              </Button>
            </div>

            {/* Order summary */}
            <div className="mt-10 sm:ml-32 sm:pl-6">
              <div className="rounded-lg bg-zinc-900 px-4 py-6 sm:p-6 lg:p-8">
                <h2 className="text-xl font-medium text-white">Order summary</h2>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-zinc-400">Subtotal</p>
                    <p className="text-sm font-medium text-white">${subtotal.toFixed(2)}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <Link
                    href="/signup?next=%2Fdashboard%2Fbilling"
                    className="flex w-full items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-transform hover:scale-105"
                  >
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}