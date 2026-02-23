import { allProducts, productCategories } from '@/lib/openprovider-products'
import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Products',
  description: 'Explore our full suite of products, from domain registration and SSL certificates to advanced DNS and security services.',
}

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Our Product Ecosystem
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-zinc-400">
          A complete suite of tools to build, secure, and scale your online presence, all powered by AI.
        </p>
      </div>

      <div className="mt-16 space-y-16">
        {productCategories.map((category) => {
          const productsInCategory = allProducts.filter(p => p.category === category.name)
          return (
            <section key={category.id} id={category.id} className="scroll-mt-20">
              <h2 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800">
                  <CheckCircle className="h-6 w-6 text-blue-400" />
                </span>
                {category.name}
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {productsInCategory.map((product) => (
                  <Link
                    href={`/products/${product.slug}`}
                    key={product.id}
                    className="group relative flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-blue-500/50 hover:bg-zinc-900"
                  >
                    <h3 className="text-lg font-semibold text-zinc-100">{product.name}</h3>
                    <p className="mt-2 flex-1 text-sm text-zinc-400">{product.description}</p>
                    <div className="mt-4 flex items-center text-sm font-medium text-blue-400">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                    {product.pricing?.startingFrom && (
                      <div className="absolute top-4 right-4 rounded-full bg-blue-600/10 px-2.5 py-1 text-xs font-semibold text-blue-300">
                        Starts at ${product.pricing.startingFrom}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}