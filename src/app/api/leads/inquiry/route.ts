import { NextResponse } from 'next/server'
import { mkdir, appendFile } from 'node:fs/promises'
import { join } from 'node:path'

export const runtime = 'nodejs'

type LeadInquiry = {
  service: 'ai-design'
  tier: 'starter' | 'pro'
  name: string
  email: string
  company?: string
  message?: string
  timestamp: string
  createdAt: string
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Partial<LeadInquiry> | null

  const name = body?.name?.toString().trim() || ''
  const email = body?.email?.toString().trim() || ''
  const tier = body?.tier === 'starter' || body?.tier === 'pro' ? body.tier : null

  if (!name || !email || !tier) {
    return NextResponse.json({ error: 'Missing name, email, or tier' }, { status: 400 })
  }

  const inquiry: LeadInquiry = {
    service: 'ai-design',
    tier,
    name,
    email,
    company: body?.company?.toString().trim() || undefined,
    message: body?.message?.toString().trim() || undefined,
    timestamp: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }

  try {
    const dataDir = join(process.cwd(), 'data')
    await mkdir(dataDir, { recursive: true })
    const file = join(dataDir, 'leads.jsonl')
    await appendFile(file, `${JSON.stringify(inquiry)}\n`, { encoding: 'utf8' })

    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to store inquiry'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
