// Lightweight suggestion engine with fuzzy scoring.
// Falls back to string heuristics; can be replaced by embedding-based logic later.

function levenshtein(a: string, b: string) {
  const matrix = []
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }
  return matrix[b.length][a.length]
}

const CANDIDATES = [
  'alpha', 'brilliant', 'neon', 'marz', 'orbit', 'quantum', 'flux', 'nova', 'zenith', 'lumen', 'grid', 'node', 'sync', 'vector', 'forge', 'stack', 'labs', 'hub', 'cloud', 'works'
]

export function getDomainSuggestions(query: string, limit = 8) {
  const q = query.trim().toLowerCase().replace(/[^a-z0-9]/g, '')
  if (!q) return []

  const scored = CANDIDATES.map((c) => {
    const base = c
    const name = `${base}`
    const dist = levenshtein(q, base)
    // score: lower distance better, bonus for prefix match
    let score = 100 - dist * 10
    if (base.startsWith(q)) score += 30
    if (base.includes(q)) score += 10
    return { name, base, score }
  })

  scored.sort((a, b) => b.score - a.score)

  // produce domain-style suggestions
  const out: string[] = []
  for (const s of scored.slice(0, limit)) {
    out.push(`${s.base}.ai`)
    out.push(`get${s.base}.com`)
  }
  return out.slice(0, limit)
}
