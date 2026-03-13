import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { getDataDir } from './dataDir'
import { getPostgresPool } from './postgres'

export type ImpactStats = {
  assetsSecured: number
  marzFundingUsd: number
  marzGoalUsd: number
  marzProgressPct: number
}

function toNumber(x: unknown): number {
  const n = typeof x === 'number' ? x : Number(String(x))
  return Number.isFinite(n) ? n : 0
}

async function readJsonl(path: string): Promise<any[]> {
  const text = await readFile(path, { encoding: 'utf8' }).catch((err: any) => {
    if (err?.code === 'ENOENT') return ''
    throw err
  })

  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      try {
        return JSON.parse(l)
      } catch {
        return null
      }
    })
    .filter(Boolean)
}

async function getFromFiles(): Promise<{ assetsSecured: number; marzFundingUsd: number }> {
  const dataDir = getDataDir()

  const alpha = await readJsonl(join(dataDir, 'alpha_list.jsonl')).catch(() => [])
  const payments = await readJsonl(join(dataDir, 'processed_payments.jsonl')).catch(() => [])

  const assetsSecured = alpha.length
  const marzFundingUsd = payments.reduce((sum, r) => sum + toNumber(r?.marzFundingUsd ?? r?.funding_usd ?? r?.fundingUsd), 0)

  return { assetsSecured, marzFundingUsd }
}

async function getFromDb(): Promise<{ assetsSecured: number; marzFundingUsd: number }> {
  const pool = getPostgresPool()

  // Ensure alpha table exists (shared with alphaStore)
  await pool.query(
    `CREATE TABLE IF NOT EXISTS public.alpha_signups (
      email text PRIMARY KEY,
      created_at timestamptz NOT NULL DEFAULT now(),
      partner_id text,
      user_agent text
    )`,
  )

  // assets secured: prefer completed Stripe sessions, but fall back to alpha signups so early traction shows up.
  const assetsRes = await pool.query<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM public.stripe_sessions WHERE status = 'COMPLETED'`,
  )

  const alphaRes = await pool.query<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM public.alpha_signups`,
  )

  const stripeCompleted = Number(assetsRes.rows?.[0]?.count || 0)
  const alphaCount = Number(alphaRes.rows?.[0]?.count || 0)
  const assetsSecured = Math.max(stripeCompleted, alphaCount)

  // funding: sum of markup amounts in USD (your margin)
  const fundingRes = await pool.query<{ sum: string | null }>(
    `SELECT COALESCE(SUM(markup_amount), 0)::text AS sum FROM public.affiliate_sales WHERE currency = 'USD'`,
  )
  const marzFundingUsd = Number(fundingRes.rows?.[0]?.sum || 0)

  return { assetsSecured, marzFundingUsd }
}

export async function getImpactStats(): Promise<ImpactStats> {
  const marzGoalUsd = (() => {
    const raw = (process.env.MARZ_GOAL_USD || '').trim()
    const n = raw ? Number(raw) : 0
    return Number.isFinite(n) && n > 0 ? n : 10000
  })()

  let assetsSecured = 0
  let marzFundingUsd = 0

  const hasDb = Boolean((process.env.DATABASE_URL || '').trim())

  if (hasDb) {
    try {
      ;({ assetsSecured, marzFundingUsd } = await getFromDb())
    } catch {
      ;({ assetsSecured, marzFundingUsd } = await getFromFiles())
    }
  } else {
    ;({ assetsSecured, marzFundingUsd } = await getFromFiles())
  }

  const marzProgressPct = Math.max(0, Math.min(100, (marzFundingUsd / marzGoalUsd) * 100))

  return {
    assetsSecured,
    marzFundingUsd,
    marzGoalUsd,
    marzProgressPct,
  }
}
