import { NextResponse } from 'next/server'
import { opClient } from '../../../../../lib/openprovider'
import { requireDeveloperKey } from '../../../../../lib/developerApiAuth'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  const auth = await requireDeveloperKey(req)
  if (!auth.ok) return auth.res

  try {
    const products = await opClient.listSslProducts()
    return NextResponse.json(
      { products, requestId: auth.ctx.requestId },
      { headers: { 'x-request-id': auth.ctx.requestId, powered_by: 'BuildWithAI.digital' } },
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load SSL products'
    return NextResponse.json(
      { error: message, requestId: auth.ctx.requestId },
      { status: 502, headers: { 'x-request-id': auth.ctx.requestId, powered_by: 'BuildWithAI.digital' } },
    )
  }
}
