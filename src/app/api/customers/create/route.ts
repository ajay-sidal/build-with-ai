import { NextResponse } from 'next/server'
import { opClient, type CustomerCreateCustomerRequest } from '../../../../lib/openprovider'
import { upsertUserTier } from '../../../../lib/userStore'
import { USER_ID_COOKIE, USER_TIER_COOKIE } from '../../../../utils/membership'
import { z } from 'zod'

export const runtime = 'nodejs'

// Input validation schema (simplified - address optional)
const CustomerCreateSchema = z.object({
  email: z.string().email('Invalid email address'),
  first_name: z.string().min(1).max(50),
  last_name: z.string().min(1).max(50),
  // Address fields are now optional - will use defaults if not provided
  street: z.string().min(1).max(100).optional(),
  number: z.string().min(1).max(20).optional(),
  zipcode: z.string().min(1).max(20).optional(),
  city: z.string().min(1).max(100).optional(),
  country: z.string().length(2).optional(),
  state: z.string().max(50).optional(),
  phone_country_code: z.string().min(1).max(5).optional(),
  phone_area_code: z.string().max(10).optional(),
  phone_subscriber_number: z.string().min(1).max(20).optional(),
})

type RequestBody = z.infer<typeof CustomerCreateSchema>

function initials(firstName: string, lastName: string) {
  const a = (firstName.trim()[0] || '').toUpperCase()
  const b = (lastName.trim()[0] || '').toUpperCase()
  return `${a}${b}` || 'NA'
}

export async function POST(req: Request) {
  // Parse and validate request body
  const body = await req.json().catch(() => null)
  const parsed = CustomerCreateSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.issues }, { status: 400 })
  }

  // Validate required fields
  if (!parsed.data.email || !parsed.data.first_name || !parsed.data.last_name) {
    return NextResponse.json({ error: 'Email, first name, and last name are required' }, { status: 400 })
  }

  try {
    // Avoid duplicate handles for the same user
    const existing = await opClient.searchCustomers(parsed.data.email)
    if (existing.length > 0 && existing[0]?.handle) {
      const handle = existing[0].handle
      try {
        await upsertUserTier({ userId: handle, tier: 'AI_EXPLORER', email: parsed.data.email || null, renewalDate: null })
      } catch {
        // ignore
      }

      const res = NextResponse.json({ handle })
      res.headers.append('Set-Cookie', `${USER_ID_COOKIE}=${encodeURIComponent(handle)}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`)
      res.headers.append('Set-Cookie', `${USER_TIER_COOKIE}=AI_EXPLORER; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax`)
      return res
    }

    // Use default address values if not provided (not location-based)
    const reqBody: CustomerCreateCustomerRequest = {
      email: parsed.data.email,
      name: {
        initials: initials(parsed.data.first_name, parsed.data.last_name),
        first_name: parsed.data.first_name,
        last_name: parsed.data.last_name,
        full_name: `${parsed.data.first_name} ${parsed.data.last_name}`.trim(),
      },
      address: {
        street: parsed.data.street || 'Not provided',
        number: parsed.data.number || 'N/A',
        zipcode: parsed.data.zipcode || '00000',
        city: parsed.data.city || 'Not provided',
        country: parsed.data.country || 'US',
        state: parsed.data.state,
      },
      phone: {
        country_code: parsed.data.phone_country_code || '1',
        area_code: parsed.data.phone_area_code,
        subscriber_number: parsed.data.phone_subscriber_number || '0000000',
      },
    }

    const handle = await opClient.createCustomer(reqBody)

    try {
      await upsertUserTier({ userId: handle, tier: 'AI_EXPLORER', email: parsed.data.email || null, renewalDate: null })
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
