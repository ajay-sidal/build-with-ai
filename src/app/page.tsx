'use client'

import { allProducts } from '@/lib/openprovider-products'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Check, ArrowRight, ShoppingCart } from 'lucide-react'
import { useCart } from '@/components/providers/CartProvider'
import { useState, useEffect, useMemo } from 'react'

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = allProducts.find((p) => p.slug === params.slug)
  const { addToCart, cartItems } = useCart()
  const [isAdded, setIsAdded] = useState(false)

  const isInCart = useMemo(() => cartItems.some(item => item.id === product?.id), [cartItems, product])

  useEffect(() => {
    // This effect ensures the button state is correct if the user navigates back/forward
    setIsAdded(false)
  }, [params.slug])

  if (!product) {
    notFound()
  }

  const handleAddToCart = () => {
    addToCart(product)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000) // Reset button visual state after 2s
  }

  return (
    <div className="bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <p className="text-base font-semibold leading-7 text-blue-400">{product.category}</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">{product.name}</h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-zinc-300">{product.description}</p>
        </div>

        {/* Main Content */}
        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-20">
          {/* Left Column: Features & Benefits */}
          <div className="space-y-10">
            <div>
              <h2 className="text-xl font-semibold text-white">Key Features</h2>
              <ul className="mt-4 space-y-2 text-zinc-400">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 flex-shrink-0 text-blue-500 mt-1" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Benefits</h2>
              <ul className="mt-4 space-y-2 text-zinc-400">
                {product.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 flex-shrink-0 text-emerald-500 mt-1" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Pricing & CTA */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 self-start">
            <h2 className="text-2xl font-bold tracking-tight text-white">Get Started</h2>
            {product.pricing && (
              <p className="mt-4 text-4xl font-bold tracking-tight text-white">
                ${product.pricing.startingFrom}
                <span className="text-base font-medium text-zinc-400">/{product.pricing.period}</span>
              </p>
            )}
            <p className="mt-4 text-zinc-400">Ready to secure your digital assets? Get started with {product.name} today.</p>
            <button
              onClick={handleAddToCart}
              disabled={isInCart}
              className="mt-8 flex w-full items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {isAdded ? <><Check className="mr-2 h-5 w-5" />Added to Cart</> : isInCart ? <><Check className="mr-2 h-5 w-5" />In Cart</> : <><ShoppingCart className="mr-2 h-5 w-5" />Add to Cart</>}
            </button>
            <Link href="/products" className="mt-4 block text-center text-sm text-zinc-400 hover:text-zinc-200">
              Compare with other products
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}