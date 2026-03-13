import { NextResponse } from 'next/server'
import { getDomainSuggestions } from '../../../../lib/suggestions'
import { getOpenAIEmbedding, cosineSim } from '../../../../lib/embeddings'

const CANDIDATES = [
  'alpha', 'brilliant', 'neon', 'marz', 'orbit', 'quantum', 'flux', 'nova', 'zenith', 'lumen', 'grid', 'node', 'sync', 'vector', 'forge', 'stack', 'labs', 'hub', 'cloud', 'works'
]

// in-memory candidate embeddings cache
// @ts-ignore
globalThis.__candidate_embs = globalThis.__candidate_embs || null

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const q = (url.searchParams.get('q') || '').trim()
    if (!q) return NextResponse.json([])

    // If OpenAI key present, compute embeddings and score candidates
    if (process.env.OPENAI_API_KEY) {
      const queryEmb = await getOpenAIEmbedding(q)
      if (queryEmb && Array.isArray(queryEmb)) {
        // compute candidate embeddings once
        // @ts-ignore
        if (!globalThis.__candidate_embs) {
          const map = new Map()
          for (const c of CANDIDATES) {
            const e = await getOpenAIEmbedding(c)
            if (e) map.set(c, e)
          }
          // @ts-ignore
          globalThis.__candidate_embs = map
        }

        // @ts-ignore
        const map: Map<string, number[]> = globalThis.__candidate_embs
        const scored: Array<{ name: string; score: number }> = []
        for (const [k, v] of map.entries()) {
          const s = cosineSim(queryEmb, v)
          scored.push({ name: k, score: s })
        }
        scored.sort((a, b) => b.score - a.score)
        const out: string[] = []
        for (const s of scored.slice(0, 6)) {
          out.push(`${s.name}.ai`)
          out.push(`get${s.name}.com`)
        }
        return NextResponse.json(out.slice(0, 8))
      }
    }

    // fallback to lightweight heuristics
    const suggestions = getDomainSuggestions(q, 8)
    return NextResponse.json(suggestions)
  } catch (e) {
    console.error('[MARZ] suggestions error', e)
    return NextResponse.json([], { status: 500 })
  }
}
