import { NextResponse } from 'next/server'
import { opClient } from '../../../../lib/openprovider'

export const runtime = 'nodejs'

type RequestBody = {
  domain: string
  is_auto_renew_enabled: boolean
}

export async function PATCH(req: Request) {
  const body = (await req.json().catch(() => null)) as RequestBody | null
  if (!body?.domain || typeof body.is_auto_renew_enabled !== 'boolean') {
    return NextResponse.json({ error: 'Missing domain or is_auto_renew_enabled' }, { status: 400 })
  }

  try {
    const data = await opClient.updateDomain(body.domain, { is_auto_renew_enabled: body.is_auto_renew_enabled })
    return NextResponse.json({ ok: true, data })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update domain'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
