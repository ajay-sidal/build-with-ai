import { NextResponse } from 'next/server'
import { mkdir, appendFile } from 'node:fs/promises'
import { join } from 'node:path'
import { cookies } from 'next/headers'
import { getDataDir } from '../../../../lib/dataDir'
import { USER_ID_COOKIE } from '../../../../utils/membership'

export const runtime = 'nodejs'

type LeadInquiry = {
  userId: string
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
  const cookieStore = await cookies()
  const userId = cookieStore.get(USER_ID_COOKIE)?.value?.trim() || ''

  const name = body?.name?.toString().trim() || ''
  const email = body?.email?.toString().trim() || ''
  const tier = body?.tier === 'starter' || body?.tier === 'pro' ? body.tier : null

  if (!userId) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  if (!name || !email || !tier) {
    return NextResponse.json({ error: 'Missing name, email, or tier' }, { status: 400 })
  }

  const inquiry: LeadInquiry = {
    userId,
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
    const dataDir = getDataDir()
    await mkdir(dataDir, { recursive: true })
    const file = join(dataDir, 'leads.jsonl')
    await appendFile(file, `${JSON.stringify(inquiry)}\n`, { encoding: 'utf8' })

    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to store inquiry'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
