import { getPostgresPool } from './postgres'

export type AlphaStats = { count: number; remaining: number; limit: number }

export type AlphaSignupResult =
  | ({ ok: true; already: boolean } & AlphaStats)
  | ({ ok: false; error: string } & Partial<AlphaStats>)

const TABLE = 'public.alpha_signups'

async function ensureTable() {
  const pool = getPostgresPool()
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${TABLE} (
      email text PRIMARY KEY,
      created_at timestamptz NOT NULL DEFAULT now(),
      partner_id text,
      user_agent text
    );
  `)
}

export async function getAlphaStatsPg(limit: number): Promise<AlphaStats> {
  await ensureTable()
  const pool = getPostgresPool()
  const { rows } = await pool.query<{ count: string }>(`SELECT COUNT(*)::text AS count FROM ${TABLE}`)
  const count = Number(rows?.[0]?.count || 0)
  return { count, remaining: Math.max(0, limit - count), limit }
}

export async function signupAlphaPg(args: {
  email: string
  partnerId?: string
  userAgent?: string
  limit: number
}): Promise<AlphaSignupResult> {
  const email = args.email.trim().toLowerCase()
  if (!email) return { ok: false, error: 'Missing email' }

  await ensureTable()
  const pool = getPostgresPool()

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // Serialize signups to enforce the 1000 limit strictly under concurrency.
    await client.query(`LOCK TABLE ${TABLE} IN EXCLUSIVE MODE`)

    const existing = await client.query<{ email: string }>(`SELECT email FROM ${TABLE} WHERE email = $1`, [email])
    const already = (existing.rowCount || 0) > 0

    const countRes = await client.query<{ count: string }>(`SELECT COUNT(*)::text AS count FROM ${TABLE}`)
    const countBefore = Number(countRes.rows?.[0]?.count || 0)

    if (!already && countBefore >= args.limit) {
      await client.query('ROLLBACK')
      return { ok: false, error: 'Alpha list is full', count: countBefore, remaining: 0, limit: args.limit }
    }

    if (!already) {
      await client.query(
        `INSERT INTO ${TABLE} (email, partner_id, user_agent) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING`,
        [email, args.partnerId || null, args.userAgent || null],
      )
    }

    const countAfterRes = await client.query<{ count: string }>(`SELECT COUNT(*)::text AS count FROM ${TABLE}`)
    const count = Number(countAfterRes.rows?.[0]?.count || 0)

    await client.query('COMMIT')

    return { ok: true, already, count, remaining: Math.max(0, args.limit - count), limit: args.limit }
  } catch (err) {
    try {
      await client.query('ROLLBACK')
    } catch {
      // ignore
    }
    const message = err instanceof Error ? err.message : 'Signup failed'
    return { ok: false, error: message }
  } finally {
    client.release()
  }
}
