export async function enrichWithClearbit(companyDomain: string) {
  const key = process.env.CLEARBIT_KEY
  if (!key) {
    console.warn('CLEARBIT_KEY not configured')
    return null
  }

  try {
    const res = await fetch(`https://company.clearbit.com/v2/companies/find?domain=${encodeURIComponent(companyDomain)}`, {
      headers: { Authorization: `Bearer ${key}` },
    })
    if (!res.ok) {
      console.warn('Clearbit returned', res.status)
      return null
    }
    const data = await res.json()
    return data
  } catch (e) {
    console.error('Clearbit error', e)
    return null
  }
}
