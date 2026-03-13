import { getPostgresPool } from './postgres'

type PromoRow = {
  tld: string
  is_hot: boolean
  reseller_amount: number | null
  currency: string | null
}

let promoTableEnsured = false

async function ensurePromoTable() {
  if (promoTableEnsured) return
  promoTableEnsured = true

  const pool = getPostgresPool()
  await pool.query(
    `CREATE TABLE IF NOT EXISTS public.tld_promos (
      tld text PRIMARY KEY,
      is_hot boolean NOT NULL DEFAULT false,
      reseller_amount numeric,
      currency text,
      updated_at timestamptz NOT NULL DEFAULT now()
    )`,
  )
}

export async function upsertTldPromo(args: {
  tld: string
  isHot: boolean
  resellerAmount?: number | null
  currency?: string | null
}) {
  await ensurePromoTable()
  const pool = getPostgresPool()
  await pool.query(
    `INSERT INTO public.tld_promos (tld, is_hot, reseller_amount, currency)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (tld)
     DO UPDATE SET is_hot=EXCLUDED.is_hot,
                   reseller_amount=EXCLUDED.reseller_amount,
                   currency=EXCLUDED.currency,
                   updated_at=now()`,
    [args.tld.toLowerCase(), args.isHot, args.resellerAmount ?? null, args.currency ?? null],
  )
}

export async function getHotTlds(): Promise<Set<string>> {
  await ensurePromoTable()
  const pool = getPostgresPool()
  const { rows } = await pool.query<Pick<PromoRow, 'tld'>>(
    `SELECT tld FROM public.tld_promos WHERE is_hot = true`,
  )
  return new Set(rows.map((r) => String(r.tld).toLowerCase()))
}

export async function listTldPromos(): Promise<Array<{ tld: string; isHot: boolean; resellerAmount: number | null; currency: string | null }>> {
  await ensurePromoTable()
  const pool = getPostgresPool()
  const { rows } = await pool.query<PromoRow>(
    `SELECT tld, is_hot, reseller_amount, currency FROM public.tld_promos ORDER BY tld ASC`,
  )
  return rows.map((r) => ({
    tld: String(r.tld),
    isHot: Boolean(r.is_hot),
    resellerAmount: r.reseller_amount == null ? null : Number(r.reseller_amount),
    currency: r.currency == null ? null : String(r.currency),
  }))
}
