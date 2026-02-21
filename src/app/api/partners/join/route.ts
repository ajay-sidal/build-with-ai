import { NextResponse } from 'next/server'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { randomBytes } from 'node:crypto'
import { getDataDir } from '../../../../lib/dataDir'

export const runtime = 'nodejs'

type PartnerRecord = {
  partnerId: string
  name: string
  email: string
  createdAt: string
}

type PartnersFile = {
  partners: Record<string, PartnerRecord>
  byEmail: Record<string, string>
}

type RequestBody = {
  name: string
  email: string
}

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function loadPartnersFile(): Promise<{ path: string; json: PartnersFile }> {
  const dataDir = getDataDir()
  await mkdir(dataDir, { recursive: true })
  const path = join(dataDir, 'partners.json')

  const text = await readFile(path, { encoding: 'utf8' }).catch((err: any) => {
    if (err?.code === 'ENOENT') return null
    throw err
  })

  if (!text) {
    return { path, json: { partners: {}, byEmail: {} } }
  }

  try {
    const json = JSON.parse(text) as PartnersFile
    return {
      path,
      json: {
        partners: json?.partners || {},
        byEmail: json?.byEmail || {},
      },
    }
  } catch {
    return { path, json: { partners: {}, byEmail: {} } }
  }
}

function getBaseUrl(req: Request) {
  const env = process.env.NEXT_PUBLIC_SITE_URL
  if (env) return env.replace(/\/$/, '')
  const origin = req.headers.get('origin') || 'http://localhost:3000'
  return origin.replace(/\/$/, '')
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as RequestBody | null
  const name = body?.name?.trim() || ''
  const email = (body?.email || '').trim().toLowerCase()

  if (!name) return NextResponse.json({ error: 'Missing name' }, { status: 400 })
  if (!email || !email.includes('@')) return NextResponse.json({ error: 'Missing/invalid email' }, { status: 400 })

  const { path, json } = await loadPartnersFile()

  const existing = json.byEmail[email]
  if (existing && json.partners[existing]) {
    const baseUrl = getBaseUrl(req)
    return NextResponse.json({
      partnerId: existing,
      referralUrl: `${baseUrl}/?ref=${encodeURIComponent(existing)}`,
      existing: true,
    })
  }

  const base = slugify(email.split('@')[0] || name) || 'partner'

  let partnerId = ''
  for (let i = 0; i < 5; i++) {
    const suffix = randomBytes(3).toString('hex')
    const candidate = `${base}-${suffix}`
    if (!json.partners[candidate]) {
      partnerId = candidate
      break
    }
  }

  if (!partnerId) {
    return NextResponse.json({ error: 'Could not generate partner id' }, { status: 500 })
  }

  const record: PartnerRecord = {
    partnerId,
    name,
    email,
    createdAt: new Date().toISOString(),
  }

  json.partners[partnerId] = record
  json.byEmail[email] = partnerId

  await writeFile(path, JSON.stringify(json, null, 2), { encoding: 'utf8' })

  const baseUrl = getBaseUrl(req)
  return NextResponse.json({
    partnerId,
    referralUrl: `${baseUrl}/?ref=${encodeURIComponent(partnerId)}`,
    existing: false,
  })
}
