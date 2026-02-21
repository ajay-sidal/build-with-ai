import { NextResponse } from 'next/server'
import { opClient } from '../../../../lib/openprovider'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const domain = url.searchParams.get('domain')?.trim()

  if (!domain) return NextResponse.json({ error: 'Missing domain' }, { status: 400 })

  try {
    const emails = await opClient.getSslApproverEmails(domain)
    return NextResponse.json({ results: emails })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load approver emails'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
