export type PricingCategory = 'DOMAIN' | 'SSL' | 'LICENSE' | (string & {})

export function calculateCustomerPrice(resellerPrice: number, category?: PricingCategory): number {
  if (!Number.isFinite(resellerPrice)) {
    throw new Error('Invalid resellerPrice')
  }

  const c = (category || '').toUpperCase()

  if (c === 'DOMAIN') {
    return Math.max(resellerPrice * 1.25, resellerPrice + 5.0)
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
