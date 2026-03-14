import { opClient } from './openprovider'

export type OpenProviderHealth = {
  ok: boolean
  resellerId: number | null
  credentialsConfigured: boolean
  sslProductCount: number
  pleskLicenseCount: number
  domainCount: number
  invoiceCount: number
  transactionCount: number
  checkedAt: string
  error: string | null
}

function hasCreds() {
  return Boolean((process.env.OPENPROVIDER_USERNAME || '').trim() && (process.env.OPENPROVIDER_PASSWORD || '').trim())
}

export async function getOpenProviderHealth(): Promise<OpenProviderHealth> {
  const credentialsConfigured = hasCreds()
  if (!credentialsConfigured) {
    return {
      ok: false,
      resellerId: null,
      credentialsConfigured,
      sslProductCount: 0,
      pleskLicenseCount: 0,
      domainCount: 0,
      invoiceCount: 0,
      transactionCount: 0,
      checkedAt: new Date().toISOString(),
      error: 'Missing OpenProvider credentials',
    }
  }

  try {
    const [sslProducts, pleskLicenses, domains, invoices, transactions] = await Promise.all([
      opClient.listSslProducts(),
      opClient.listPleskLicenses(),
      opClient.listDomains(),
      opClient.listInvoices(),
      opClient.listTransactions(),
    ])

    return {
      ok: true,
      resellerId: opClient.getResellerId(),
      credentialsConfigured,
      sslProductCount: sslProducts.length,
      pleskLicenseCount: pleskLicenses.length,
      domainCount: domains.length,
      invoiceCount: invoices.length,
      transactionCount: transactions.length,
      checkedAt: new Date().toISOString(),
      error: null,
    }
  } catch (err) {
    return {
      ok: false,
      resellerId: opClient.getResellerId(),
      credentialsConfigured,
      sslProductCount: 0,
      pleskLicenseCount: 0,
      domainCount: 0,
      invoiceCount: 0,
      transactionCount: 0,
      checkedAt: new Date().toISOString(),
      error: err instanceof Error ? err.message : 'OpenProvider health check failed',
    }
  }
}