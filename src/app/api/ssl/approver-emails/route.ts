import { NextResponse } from 'next/server'
import { opClient } from '../../../../lib/openprovider'
import { randomUUID } from 'node:crypto'

export const runtime = 'nodejs'

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

function json(body: any, init: { requestId: string; status?: number }) {
  return NextResponse.json(body, {
    status: init.status,
    headers: { 'x-request-id': init.requestId },
  })
}

export async function GET(req: Request) {
  const requestId = randomUUID()
  const url = new URL(req.url)
  const domain = url.searchParams.get('domain')?.trim() || ''

  if (!domain) return json({ error: 'Missing domain', requestId }, { status: 400, requestId })
  if (!isValidFqdn(domain)) {
    return json(
      { error: 'Enter a valid domain like example.com (not an email address).', requestId },
      { status: 400, requestId },
    )
  }

  try {
    const emails = await opClient.getSslApproverEmails(domain)
    return json({ results: emails, requestId }, { requestId })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load approver emails'

    // OpenProvider sometimes returns a confusing message for invalid input; treat as 400.
    if (/empty field for the type ssl/i.test(message)) {
      return json(
        { error: 'Enter a valid domain like example.com (not an email address).', requestId },
        { status: 400, requestId },
      )
    }

    return json({ error: message, requestId }, { status: 502, requestId })
  }
}
