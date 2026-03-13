import type Stripe from 'stripe'
import { mkdir, readFile, appendFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { getDataDir } from './dataDir'

export type StripeMetadata = Record<string, string>

export type ProvisioningOpClient = {
  createDomain: (
    request: any,
    options?: { provisionDnsZone?: boolean },
  ) => Promise<any>
  createDnsZone: (request: { domain: string; type: 'master' }) => Promise<any>
  createPleskLicense: (request: { domain_name: string; period: number; items: string[] }) => Promise<any>
}

export type ProcessOptions = {
  dataDir?: string
}

export type ProcessResult = {
  processed: boolean
  reason?: 'already_processed' | 'ignored'
}

function safeJsonParse<T>(line: string): T | null {
  try {
    return JSON.parse(line) as T
  } catch {
    return null
  }
}

async function readJsonlLines(path: string): Promise<string[]> {
  const text = await readFile(path, { encoding: 'utf8' }).catch((err: any) => {
    if (err?.code === 'ENOENT') return ''
    throw err
  })
  return text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
}

export async function hasProcessedStripeSession(args: {
  dataDir: string
  stripeSessionId: string
}): Promise<boolean> {
  const path = join(args.dataDir, 'processed_payments.jsonl')
  const lines = await readJsonlLines(path)
  for (const line of lines) {
    const rec = safeJsonParse<{ stripeSessionId?: string }>(line)
    if (rec?.stripeSessionId && rec.stripeSessionId === args.stripeSessionId) return true
  }
  return false
}

export async function markStripeSessionProcessed(args: {
  dataDir: string
  stripeSessionId: string
  eventId: string
  status: 'STARTED' | 'COMPLETED'
  paymentType?: string
}): Promise<void> {
  await mkdir(args.dataDir, { recursive: true })
  const path = join(args.dataDir, 'processed_payments.jsonl')
  const record = {
    createdAt: new Date().toISOString(),
    stripeSessionId: args.stripeSessionId,
    eventId: args.eventId,
    paymentType: args.paymentType || 'unknown',
    status: args.status,
  }
  await appendFile(path, JSON.stringify(record) + '\n', { encoding: 'utf8' })
}

export async function processCheckoutSessionCompleted(args: {
  session: Stripe.Checkout.Session
  metadata: StripeMetadata
  eventId: string
  opClient: ProvisioningOpClient
  options?: ProcessOptions
}): Promise<ProcessResult> {
  const dataDir = args.options?.dataDir || getDataDir()
  const stripeSessionId = args.session.id
  const paymentType = (args.metadata.payment_type || '').toString()

  if (!stripeSessionId) return { processed: false, reason: 'ignored' }

  // Idempotency guard (append-only, best-effort)
  const already = await hasProcessedStripeSession({ dataDir, stripeSessionId })
  if (already) return { processed: false, reason: 'already_processed' }

  await markStripeSessionProcessed({
    dataDir,
    stripeSessionId,
    eventId: args.eventId,
    status: 'STARTED',
    paymentType,
  })

  // --- LICENSE ---
  if (paymentType === 'LICENSE_PURCHASE') {
    const domainName = (args.metadata.domain_name || '').toString().trim()
    const item = (args.metadata.item || 'PLESK-12-VPS-WEB-HOST-1M').toString().trim()

    if (domainName) {
      await args.opClient.createPleskLicense({ domain_name: domainName, period: 1, items: [item] })
    }

    await markStripeSessionProcessed({
      dataDir,
      stripeSessionId,
      eventId: args.eventId,
      status: 'COMPLETED',
      paymentType,
    })

    return { processed: true }
  }

  // --- SERVICE DEPOSIT ---
  if (paymentType === 'SERVICE_DEPOSIT') {
    const slug = (args.metadata.proposal_slug || 'unknown').toString()
    const email = (args.metadata.lead_email || '').toString().trim().toLowerCase()
    const name = (args.metadata.lead_name || '').toString()

    await mkdir(dataDir, { recursive: true })

    const projectDir = join(dataDir, 'projects', slug)
    await mkdir(projectDir, { recursive: true })
    await writeFile(
      join(projectDir, 'project.json'),
      JSON.stringify(
        {
          slug,
          lead: { name, email },
          stripe: { sessionId: stripeSessionId, paymentStatus: args.session.payment_status },
          createdAt: new Date().toISOString(),
        },
        null,
        2,
      ),
      { encoding: 'utf8' },
    )

    if (email) {
      const statusFile = join(dataDir, 'lead-statuses.json')
      const statusText = await readFile(statusFile, { encoding: 'utf8' }).catch((err: any) => {
        if (err?.code === 'ENOENT') return '{}'
        throw err
      })

      const map = (() => {
        try {
          return JSON.parse(statusText) as Record<string, 'New' | 'Contacted' | 'Closed'>
        } catch {
          return {} as Record<string, 'New' | 'Contacted' | 'Closed'>
        }
      })()

      map[email] = 'Closed'
      await writeFile(statusFile, JSON.stringify(map, null, 2), { encoding: 'utf8' })
    }

    await markStripeSessionProcessed({
      dataDir,
      stripeSessionId,
      eventId: args.eventId,
      status: 'COMPLETED',
      paymentType,
    })

    return { processed: true }
  }

  // --- DOMAIN ---
  const domainName = args.metadata.domain_name
  const tld = args.metadata.tld
  const ownerHandle = args.metadata.owner_handle

  if (domainName && tld && ownerHandle) {
    const fqdn = args.metadata.fqdn || `${domainName}.${tld}`

    await args.opClient.createDomain(
      {
        domain: { name: domainName, extension: tld },
        owner_handle: ownerHandle,
        admin_handle: ownerHandle,
        tech_handle: ownerHandle,
        billing_handle: ownerHandle,
        period: 1,
      },
      { provisionDnsZone: false },
    )

    await args.opClient.createDnsZone({ domain: fqdn, type: 'master' })

    await markStripeSessionProcessed({
      dataDir,
      stripeSessionId,
      eventId: args.eventId,
      status: 'COMPLETED',
      paymentType: 'DOMAIN',
    })

    return { processed: true }
  }

  await markStripeSessionProcessed({
    dataDir,
    stripeSessionId,
    eventId: args.eventId,
    status: 'COMPLETED',
    paymentType: paymentType || 'unknown',
  })

  return { processed: false, reason: 'ignored' }
}
