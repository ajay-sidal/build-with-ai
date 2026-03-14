import { getPostgresPool } from './postgres'
import type { UserTier } from '../utils/membership'

export type DbUser = {
  user_id: string
  email: string | null
  subscription_tier: UserTier
  renewal_date: string | null
}

let usersTableEnsured = false

async function ensureUsersTable() {
  if (usersTableEnsured) return
  usersTableEnsured = true

  const pool = getPostgresPool()
  await pool.query(
    `CREATE TABLE IF NOT EXISTS public.users (
      user_id text PRIMARY KEY,
      email text,
      subscription_tier text NOT NULL DEFAULT 'AI_EXPLORER',
      renewal_date timestamptz,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )`,
  )
}

export async function upsertUserTier(args: {
  userId: string
  tier: UserTier
  email?: string | null
  renewalDate?: string | null
}) {
  await ensureUsersTable()
  const pool = getPostgresPool()
  await pool.query(
    `INSERT INTO public.users (user_id, email, subscription_tier, renewal_date)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (user_id)
     DO UPDATE SET email = COALESCE(EXCLUDED.email, public.users.email),
                   subscription_tier = EXCLUDED.subscription_tier,
                   renewal_date = COALESCE(EXCLUDED.renewal_date, public.users.renewal_date),
                   updated_at = now()`,
    [args.userId, args.email ?? null, args.tier, args.renewalDate ?? null],
  )
}

export async function getUser(userId: string): Promise<DbUser | null> {
  await ensureUsersTable()
  const pool = getPostgresPool()
  const { rows } = await pool.query<DbUser>(
    `SELECT user_id, email, subscription_tier, renewal_date FROM public.users WHERE user_id=$1`,
    [userId],
  )
  return rows[0] || null
}

export async function getLatestUser(): Promise<DbUser | null> {
  await ensureUsersTable()
  const pool = getPostgresPool()
  const { rows } = await pool.query<DbUser>(
    `SELECT user_id, email, subscription_tier, renewal_date
     FROM public.users
     ORDER BY updated_at DESC NULLS LAST, created_at DESC NULLS LAST
     LIMIT 1`,
  )
  return rows[0] || null
}
