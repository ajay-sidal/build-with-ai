'use client'

import * as React from 'react'
import { Shield, KeyRound, Lock, Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Textarea } from '../../components/ui/textarea'
import { Card, CardContent, CardHeader } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Select } from '../../components/ui/select'
import { generateSslCredentials } from '../../utils/crypto'

type SslProduct = {
  id: number | string
  name?: string
  description?: string
  prices?: { reseller?: { currency: string; price: number } }
}

type ProductsResponse = { results: SslProduct[] } | { error: string }

type ApproverEmailsResponse = { results: string[] } | { error: string }

function isValidFqdn(value: string): boolean {
  const v = value.trim().toLowerCase()
  if (!v) return false
  if (v.includes('@')) return false
  if (v.includes(' ')) return false
  if (v.length > 253) return false
  if (!v.includes('.')) return false
  if (!/^[a-z0-9.-]+$/.test(v)) return false
  if (v.startsWith('.') || v.endsWith('.')) return false
  const labels = v.split('.').filter(Boolean)
  if (labels.length < 2) return false
  for (const label of labels) {
    if (label.length < 1 || label.length > 63) return false
    if (label.startsWith('-') || label.endsWith('-')) return false
    if (!/^[a-z0-9-]+$/.test(label)) return false
  }
  return true
}

function formatMoney(currency: string, amount: number) {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount)
  } catch {
    return `${currency} ${amount.toFixed(2)}`
  }
}

export default function SslVaultClient() {
  const [products, setProducts] = React.useState<SslProduct[]>([])
  const [productId, setProductId] = React.useState<string>('')

  const [domain, setDomain] = React.useState('')
  const [approverEmails, setApproverEmails] = React.useState<string[]>([])
  const [approverEmail, setApproverEmail] = React.useState('')

  const [csrPem, setCsrPem] = React.useState('')
  const [downloadKey, setDownloadKey] = React.useState<null | (() => void)>(null)

  const [isLoadingProducts, setIsLoadingProducts] = React.useState(false)
  const [isLoadingEmails, setIsLoadingEmails] = React.useState(false)
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    async function loadProducts() {
      setIsLoadingProducts(true)
      setError(null)
      try {
        const res = await fetch('/api/ssl/products')
        const data = (await res.json()) as ProductsResponse
        if (!res.ok) throw new Error('error' in data ? data.error : 'Failed to load products')
        if ('error' in data) throw new Error(data.error)
        if (cancelled) return
        setProducts(data.results)
        if (data.results[0]?.id != null) setProductId(String(data.results[0].id))
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Failed to load products')
      } finally {
        if (!cancelled) setIsLoadingProducts(false)
      }
    }
    loadProducts()
    return () => {
      cancelled = true
    }
  }, [])

  const selectedProduct = products.find((p) => String(p.id) === productId)

  async function loadApproverEmails() {
    const trimmed = domain.trim().toLowerCase()
    if (!trimmed) return
    if (!isValidFqdn(trimmed)) {
      setError('Enter a valid domain like example.com (not an email address).')
      return
    }

    setIsLoadingEmails(true)
    setError(null)
    setApproverEmails([])
    setApproverEmail('')

    try {
      const res = await fetch(`/api/ssl/approver-emails?domain=${encodeURIComponent(trimmed)}`)
      const data = (await res.json()) as ApproverEmailsResponse
      if (!res.ok) throw new Error('error' in data ? data.error : 'Failed to load approver emails')
      if ('error' in data) throw new Error(data.error)
      setApproverEmails(data.results)
      if (data.results[0]) setApproverEmail(data.results[0])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load approver emails')
    } finally {
      setIsLoadingEmails(false)
    }
  }

  async function onGenerate() {
    const cn = domain.trim().toLowerCase()
    if (!cn) {
      setError('Enter a domain (Common Name) before generating')
      return
    }
    if (!isValidFqdn(cn)) {
      setError('Enter a valid domain like example.com (not an email address).')
      return
    }

    setIsGenerating(true)
    setError(null)
    try {
      const creds = await generateSslCredentials({ commonName: cn })
      setCsrPem(creds.csrPem)
      setDownloadKey(() => () => creds.downloadPrivateKey(`${cn}.key`))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate credentials')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-16">
      <div className="flex items-center gap-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
          <Shield size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">SSL Vault</h1>
          <p className="mt-1 text-sm text-zinc-400">Generate keys locally. Keep secrets client-side.</p>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-800/40 bg-red-950/20 p-4 text-sm text-red-200">{error}</div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-zinc-800 bg-zinc-950/60">
          <CardHeader>
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
              <Lock size={16} /> Product + Approver
            </div>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid gap-2">
              <label className="text-xs text-zinc-400">SSL Product</label>
              <Select
                className=""
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                disabled={isLoadingProducts}
              >
                {products.map((p) => (
                  <option key={String(p.id)} value={String(p.id)}>
                    {p.name || `Product ${p.id}`}
                  </option>
                ))}
              </Select>
              {isLoadingProducts ? (
                <div className="text-xs text-zinc-500">Loading products…</div>
              ) : selectedProduct?.prices?.reseller ? (
                <div className="text-xs text-zinc-500">
                  Reseller: {formatMoney(selectedProduct.prices.reseller.currency, selectedProduct.prices.reseller.price)}
                </div>
              ) : null}
            </div>

            <div className="grid gap-2">
              <label className="text-xs text-zinc-400">Domain (Common Name)</label>
              <div className="flex gap-3">
                <Input
                  id="ssl-common-name"
                  name="domain"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="example.com"
                />
                <Button
                  type="button"
                  variant="secondary"
                  className="h-12"
                  onClick={loadApproverEmails}
                  disabled={isLoadingEmails}
                >
                  {isLoadingEmails ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="animate-spin" size={16} /> Fetching…
                    </span>
                  ) : (
                    'Get emails'
                  )}
                </Button>
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-xs text-zinc-400">Approver Email</label>
              <Select
                className=""
                value={approverEmail}
                onChange={(e) => setApproverEmail(e.target.value)}
                disabled={approverEmails.length === 0}
              >
                {approverEmails.length === 0 ? <option value="">Fetch emails first</option> : null}
                {approverEmails.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-950/60">
          <CardHeader>
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
              <KeyRound size={16} /> Local Keypair + CSR
            </div>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button type="button" className="h-12" onClick={onGenerate} disabled={isGenerating}>
              {isGenerating ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="animate-spin" size={16} /> Generating…
                </span>
              ) : (
                'Generate 2048-bit RSA keypair'
              )}
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="h-12"
              onClick={() => downloadKey?.()}
              disabled={!downloadKey}
            >
              Download private key (.key)
            </Button>

            <div className="grid gap-2">
              <label className="text-xs text-zinc-400">CSR (PEM)</label>
              <Textarea
                className="min-h-44 w-full resize-y rounded-md border border-zinc-800 bg-zinc-950 px-4 py-3 font-mono text-xs text-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-200/20"
                value={csrPem}
                readOnly
                placeholder="Generate to produce a CSR…"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
