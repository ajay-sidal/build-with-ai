// Minimal OpenAI embeddings helper with in-memory caching.
export async function getOpenAIEmbedding(text: string) {
  const key = process.env.OPENAI_API_KEY
  if (!key) return null

  const cacheKey = `emb:${text}`
  // simple in-memory cache
  // @ts-ignore
  globalThis.__emb_cache = globalThis.__emb_cache || new Map()
  // @ts-ignore
  const cache = globalThis.__emb_cache
  if (cache.has(cacheKey)) return cache.get(cacheKey)

  try {
    const res = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({ model: 'text-embedding-3-small', input: text }),
    })
    if (!res.ok) {
      console.warn('OpenAI embedding failed', await res.text())
      return null
    }
    const payload = await res.json()
    const emb = payload?.data?.[0]?.embedding ?? null
    cache.set(cacheKey, emb)
    return emb
  } catch (e) {
    console.error('Embedding error', e)
    return null
  }
}

export function cosineSim(a: number[], b: number[]) {
  if (!a || !b || a.length !== b.length) return -1
  let dot = 0
  let na = 0
  let nb = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    na += a[i] * a[i]
    nb += b[i] * b[i]
  }
  if (na === 0 || nb === 0) return -1
  return dot / (Math.sqrt(na) * Math.sqrt(nb))
}
