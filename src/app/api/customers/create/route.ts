import { NextResponse } from 'next/server'
import { opClient, type CustomerCreateCustomerRequest } from '../../../../lib/openprovider'
import { upsertUserTier } from '../../../../lib/userStore'
import { USER_ID_COOKIE, USER_TIER_COOKIE } from '../../../../utils/membership'

export const runtime = 'nodejs'

type RequestBody = {
  email: string
  first_name: string
  last_name: string
  street: string
  number: string
  zipcode: string
  city: string
  country: string
  state?: string
  phone_country_code: string
  phone_area_code?: string
  phone_subscriber_number: string
}

function initials(firstName: string, lastName: string) {
  const a = (firstName.trim()[0] || '').toUpperCase()
  const b = (lastName.trim()[0] || '').toUpperCase()
  return `${a}${b}` || 'NA'
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as RequestBody | null

  if (!body?.email || !body.first_name || !body.last_name) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    // Avoid duplicate handles for the same user
    const existing = await opClient.searchCustomers(body.email)
    if (existing.length > 0 && existing[0]?.handle) {
      const handle = existing[0].handle
      try {
        await upsertUserTier({ userId: handle, tier: 'AI_EXPLORER', email: body.email || null, renewalDate: null })
      } catch {
        // ignore
      }

      const res = NextResponse.json({ handle })
      res.headers.append('Set-Cookie', `${USER_ID_COOKIE}=${encodeURIComponent(handle)}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`)
      res.headers.append('Set-Cookie', `${USER_TIER_COOKIE}=AI_EXPLORER; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax`)
      return res
    }

    const reqBody: CustomerCreateCustomerRequest = {
      email: body.email,
      name: {
        initials: initials(body.first_name, body.last_name),
        first_name: body.first_name,
        last_name: body.last_name,
        full_name: `${body.first_name} ${body.last_name}`.trim(),
      },
      address: {
        street: body.street,
        number: body.number,
        zipcode: body.zipcode,
        city: body.city,
        country: body.country,
        state: body.state,
      },
      phone: {
        country_code: body.phone_country_code,
        area_code: body.phone_area_code,
        subscriber_number: body.phone_subscriber_number,
      },
    }

    const handle = await opClient.createCustomer(reqBody)

    try {
      await upsertUserTier({ userId: handle, tier: 'AI_EXPLORER', email: body.email || null, renewalDate: null })
    } catch {
      // ignore
    }

    const res = NextResponse.json({ handle })
    res.headers.append('Set-Cookie', `${USER_ID_COOKIE}=${encodeURIComponent(handle)}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`)
    res.headers.append('Set-Cookie', `${USER_TIER_COOKIE}=AI_EXPLORER; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax`)
    return res
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Customer creation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
