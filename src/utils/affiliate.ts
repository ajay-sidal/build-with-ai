export const AFFILIATE_COOKIE_NAME = 'bwai_ref'

export type AffiliateRef = string

export function setAffiliateRefCookie(partnerId: AffiliateRef, days = 30) {
  if (typeof document === 'undefined') return

  const trimmed = partnerId.trim()
  if (!trimmed) return

  const maxAge = Math.max(1, Math.floor(days * 24 * 60 * 60))
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:'

  document.cookie = [
    `${AFFILIATE_COOKIE_NAME}=${encodeURIComponent(trimmed)}`,
    'Path=/',
    `Max-Age=${maxAge}`,
    'SameSite=Lax',
    secure ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ')
}

export function getAffiliateRefCookie(): AffiliateRef | null {
  if (typeof document === 'undefined') return null
  const m = document.cookie.match(new RegExp(`(?:^|; )${AFFILIATE_COOKIE_NAME}=([^;]*)`))
  return m ? decodeURIComponent(m[1]!) : null
}

export function clearAffiliateRefCookie() {
  if (typeof document === 'undefined') return
  document.cookie = `${AFFILIATE_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`
}

export function parseCookieHeader(cookieHeader: string | null | undefined): Record<string, string> {
  const out: Record<string, string> = {}
  if (!cookieHeader) return out

  const safeDecode = (value: string) => {
    try {
      return decodeURIComponent(value)
    } catch {
      return value
    }
  }

  for (const part of cookieHeader.split(';')) {
    const [k, ...rest] = part.trim().split('=')
    if (!k) continue
    out[k] = safeDecode(rest.join('=') || '')
  }
  return out
}
