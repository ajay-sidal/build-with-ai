export type PricingCategory = 'DOMAIN' | 'SSL' | 'LICENSE' | (string & {})

export function calculateCustomerPrice(
  resellerPrice: number,
  category?: PricingCategory,
  options?: { userTier?: 'AI_EXPLORER' | 'AI_ARCHITECT' | 'ENTERPRISE_AI' },
): number {
  if (!Number.isFinite(resellerPrice)) {
    throw new Error('Invalid resellerPrice')
  }

  const c = (category || '').toUpperCase()

  if (c === 'DOMAIN') {
    const tier = (options?.userTier || 'AI_EXPLORER').toUpperCase() as
      | 'AI_EXPLORER'
      | 'AI_ARCHITECT'
      | 'ENTERPRISE_AI'

    if (tier === 'ENTERPRISE_AI') return resellerPrice

    const percent = tier === 'AI_ARCHITECT' ? 0.1 : 0.25
    const floorAdd = tier === 'AI_ARCHITECT' ? 2.0 : 5.0
    return Math.max(resellerPrice * (1 + percent), resellerPrice + floorAdd)
  }

  if (c === 'SSL') {
    return resellerPrice * 1.4
  }

  if (c === 'LICENSE') {
    return resellerPrice * 1.15
  }

  return resellerPrice * 1.2
}

export function formatCurrency(currency: string, amount: number, locales?: string | string[]): string {
  if (!currency || !Number.isFinite(amount)) return String(amount)

  try {
    return new Intl.NumberFormat(locales, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `${currency} ${amount.toFixed(2)}`
  }
}
