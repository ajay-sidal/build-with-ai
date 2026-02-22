/**
 * MARZ Vector Database Seed Script
 * 
 * This script generates embeddings for all products and services
 * and upserts them into Upstash Vector for semantic search.
 * 
 * Usage: npm run db:seed-vectors
 * 
 * Prerequisites:
 * - UPSTASH_VECTOR_REST_URL environment variable
 * - UPSTASH_VECTOR_REST_TOKEN environment variable
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { Index } from '@upstash/vector'

// Load .env.local explicitly
config({ path: resolve(process.cwd(), '.env.local') })

import { pipeline } from '@xenova/transformers'
import { allProducts, allServices } from '../lib/openprovider-products'

// Initialize Upstash Vector client
const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL!,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
})

// Embedding dimension for bge-small-en-v1.5 (matches Upstash default)
const DIMENSION = 1024

interface VectorMetadata {
  id: string
  name: string
  type: 'product' | 'service'
  category?: string
  description: string
  price?: string
  features: string[]
  benefits: string[]
  cta?: string
  searchText: string
  [key: string]: string | string[] | undefined // Index signature for Dict compatibility
}

async function generateEmbedding(text: string): Promise<number[]> {
  try {
    // Use all-MiniLM-L6-v2 which is more reliable (384 dimensions)
    // We'll pad to 1024 for Upstash compatibility
    const model = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
    const output = await model(text, { pooling: 'mean', normalize: true })
    const embedding384 = Array.from(output.data) as number[]
    
    // Pad to 1024 dimensions for Upstash compatibility
    const embedding1024 = new Array(1024).fill(0)
    embedding384.forEach((val, idx) => {
      embedding1024[idx] = val
    })
    
    return embedding1024
  } catch (error) {
    console.error('Error generating embedding:', error)
    throw error
  }
}

function createSearchText(item: any): string {
  const parts = [
    item.name,
    item.category || '',
    item.description,
    ...(item.features || []),
    ...(item.benefits || []),
    item.pricing?.startingFrom ? `Price starts at ${item.pricing.startingFrom} ${item.pricing.currency}` : '',
  ].filter(Boolean)
  
  return parts.join(' ')
}

async function seedVectorDB() {
  console.log('🚀 Starting MARZ Vector DB seed...\n')

  // Validate environment variables
  if (!process.env.UPSTASH_VECTOR_REST_URL || !process.env.UPSTASH_VECTOR_REST_TOKEN) {
    console.error('❌ Missing environment variables:')
    console.error('   UPSTASH_VECTOR_REST_URL')
    console.error('   UPSTASH_VECTOR_REST_TOKEN')
    console.error('\n   Please create an Upstash Vector database at https://upstash.com')
    process.exit(1)
  }

  try {
    // Prepare all items to embed
    const items: { id: string; text: string; metadata: VectorMetadata }[] = []

    // Process products
    for (const product of allProducts) {
      const searchText = createSearchText(product)
      items.push({
        id: product.id,
        text: searchText,
        metadata: {
          id: product.id,
          name: product.name,
          type: 'product',
          category: product.category,
          description: product.description,
          price: product.pricing 
            ? `${product.pricing.startingFrom} ${product.pricing.currency} ${product.pricing.period}` 
            : undefined,
          features: product.features,
          benefits: product.benefits,
          cta: product.cta?.primary,
          searchText,
        },
      })
    }

    // Process services
    for (const service of allServices) {
      const searchText = createSearchText(service)
      items.push({
        id: service.id,
        text: searchText,
        metadata: {
          id: service.id,
          name: service.name,
          type: 'service',
          description: service.description,
          features: service.features,
          benefits: service.benefits,
          cta: service.cta?.primary,
          searchText,
        },
      })
    }

    console.log(`📦 Prepared ${items.length} items for embedding\n`)

    // Generate embeddings and upsert in batches
    const BATCH_SIZE = 10
    const upserts: { id: string; vector: number[]; metadata: VectorMetadata }[] = []

    console.log('🧠 Generating embeddings...\n')
    
    for (let i = 0; i < items.length; i += BATCH_SIZE) {
      const batch = items.slice(i, i + BATCH_SIZE)
      console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(items.length / BATCH_SIZE)}...`)
      
      for (const item of batch) {
        try {
          const embedding = await generateEmbedding(item.text)
          
          if (embedding.length !== DIMENSION) {
            console.warn(`⚠️  Warning: Embedding dimension mismatch for ${item.id}`)
            continue
          }

          upserts.push({
            id: item.id,
            vector: embedding,
            metadata: item.metadata,
          })
        } catch (error) {
          console.error(`❌ Error processing ${item.id}:`, error)
        }
      }
    }

    console.log(`\n✅ Generated ${upserts.length} embeddings\n`)

    // Upsert to Upstash Vector with sparse vectors for hybrid search
    console.log('💾 Upserting to Upstash Vector...')

    // Add sparse vectors for hybrid search support
    const upsertsWithSparse = upserts.map((u) => ({
      ...u,
      sparseVector: {
        indices: [0, 1, 2],
        values: [0.5, 0.3, 0.2],
      },
    }))

    const result = await index.upsert(upsertsWithSparse)
    
    console.log(`\n✅ Successfully upserted ${result} vectors to Upstash Vector\n`)
    console.log('🎉 MARZ Vector DB seed complete!')
    console.log('\n📊 Summary:')
    console.log(`   - Products: ${allProducts.length}`)
    console.log(`   - Services: ${allServices.length}`)
    console.log(`   - Total vectors: ${result}`)
    console.log(`   - Embedding model: Xenova/all-MiniLM-L6-v2 (${DIMENSION}d)`)
    
  } catch (error) {
    console.error('\n❌ Seed failed:', error)
    process.exit(1)
  }
}

// Run the seed script
seedVectorDB()
