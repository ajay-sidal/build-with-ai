export type DiscountCode = 'ALPHA50' | (string & {})

function round2(n: number) {
  return Math.round(n * 100) / 100
}

/**
 * Applies a discount transform to a number.
 *
 * Note: this is a generic primitive; for checkout you typically want to use
 * `applyDiscountToCustomerPrice` to ensure floors against reseller prices.
 */
export function applyDiscount(price: number, code: string): number {
  if (!Number.isFinite(price)) throw new Error('Invalid price')
  const c = (code || '').trim().toUpperCase()

  if (c === 'ALPHA50') {
    return round2(price * 0.5)
  }

  return round2(price)
}

export function applyDiscountToCustomerPrice(args: {
  customerPrice: number
  resellerPrice: number
  code?: string
}): { customerPrice: number; discounted: boolean } {
  const customerPrice = args.customerPrice
  const resellerPrice = args.resellerPrice
  const code = (args.code || '').trim().toUpperCase()

  if (!Number.isFinite(customerPrice) || !Number.isFinite(resellerPrice)) {
    throw new Error('Invalid price inputs')
  }

  if (!code) return { customerPrice: round2(customerPrice), discounted: false }

  const markup = Math.max(0, customerPrice - resellerPrice)
  const discountedMarkup = applyDiscount(markup, code)
  const discountedCustomer = Math.max(resellerPrice, resellerPrice + discountedMarkup)

  const final = round2(discountedCustomer)
  const discounted = final !== round2(customerPrice)
  return { customerPrice: final, discounted }
}
