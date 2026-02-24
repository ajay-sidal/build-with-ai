#!/usr/bin/env tsx
import { getOpenAIEmbedding } from '../lib/embeddings'
import { upsertCandidate } from '../lib/vectorStore'

const CANDIDATES = [
  'alpha', 'brilliant', 'neon', 'marz', 'orbit', 'quantum', 'flux', 'nova', 'zenith', 'lumen', 'grid', 'node', 'sync', 'vector', 'forge', 'stack', 'labs', 'hub', 'cloud', 'works'
]

async function main() {
  console.log('Seeding candidate embeddings...')
  for (const c of CANDIDATES) {
    console.log('Embedding:', c)
    const emb = await getOpenAIEmbedding(c)
    if (!emb) {
      console.warn('Embedding missing for', c)
      continue
    }
    const id = await upsertCandidate(c, emb)
    console.log('Upserted', c, '->', id)
  }
  console.log('Done')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
