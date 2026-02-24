// Lightweight Upstash Vector wrapper (optional). Falls back gracefully if not configured.
import type { Vector as UpstashVector } from '@upstash/vector'

let client: UpstashVector | null = null

function initClient(): UpstashVector | null {
  if (client) return client
  const url = process.env.UPSTASH_VECTOR_URL
  const token = process.env.UPSTASH_VECTOR_TOKEN
  const index = process.env.UPSTASH_VECTOR_INDEX || 'marz-candidates'
  if (!url || !token) {
    console.warn('Upstash Vector not configured (UPSTASH_VECTOR_URL / TOKEN)')
    return null
  }
  // lazy require
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { Vector } = require('@upstash/vector')
  client = new Vector({ url, token, indexName: index })
  return client
}

export async function upsertCandidate(name: string, embedding: number[]) {
  const c = initClient()
  if (!c) return null
  try {
    const id = `candidate:${name}`
    // cast to any because runtime client may not match TS typings exactly
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cc: any = c
    await cc.upsert?.([{ id, vector: embedding, metadata: { name } }])
    return id
  } catch (e) {
    console.error('Upsert candidate failed', e)
    return null
  }
}

export async function queryCandidates(embedding: number[], topK = 8) {
  const c = initClient()
  if (!c) return []
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cc: any = c
    const results = await cc.search?.({ vector: embedding, topK })
    return results || [] // array of { id, score, metadata }
  } catch (e) {
    console.error('Query candidates failed', e)
    return []
  }
}
