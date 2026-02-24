export async function findContactsWithHunter(domain: string) {
  const key = process.env.HUNTER_API_KEY
  if (!key) {
    console.warn('HUNTER_API_KEY not configured')
    return null
  }

  try {
    const res = await fetch(`https://api.hunter.io/v2/domain-search?domain=${encodeURIComponent(domain)}&limit=10&api_key=${key}`)
    if (!res.ok) {
      console.warn('Hunter returned', res.status)
      return null
    }
    const data = await res.json()
    return data
  } catch (e) {
    console.error('Hunter error', e)
    return null
  }
}
