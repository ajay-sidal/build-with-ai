import { randomUUID } from 'node:crypto'

import { getPostgresPool } from './postgres'

export type MarzIdentityRecord = {
  id: string
  identity_name: string
  owner_handle: string | null
  gas_sponsored_usd: number
  status: string
  tx_ref: string | null
  created_at: string
}

let marzTableEnsured = false

async function ensureMarzTable() {
  if (marzTableEnsured) return
  marzTableEnsured = true

  const pool = getPostgresPool()
  await pool.query(
    `CREATE TABLE IF NOT EXISTS public.marz_identities (
      id text PRIMARY KEY,
      identity_name text NOT NULL UNIQUE,
      owner_handle text,
      gas_sponsored_usd numeric(12,2) NOT NULL DEFAULT 0,
      status text NOT NULL DEFAULT 'minted',
      tx_ref text,
      created_at timestamptz NOT NULL DEFAULT now()
    )`,
  )
}

export async function getMarzDashboardData(ownerHandle?: string | null): Promise<{
  totalIdentities: number
  gasSponsoredUsd: number
  assets: Array<{
    id: string
    identity: string
    status: string
    gasSponsoredUsd: number
    createdAt: string
  }>
}> {
  await ensureMarzTable()
  const pool = getPostgresPool()

  const [countRes, gasRes, assetsRes] = await Promise.all([
    pool.query<{ count: string }>('SELECT COUNT(*)::text AS count FROM public.marz_identities'),
    pool.query<{ sum: string | null }>('SELECT COALESCE(SUM(gas_sponsored_usd), 0)::text AS sum FROM public.marz_identities'),
    ownerHandle
      ? pool.query<MarzIdentityRecord>(
          `SELECT id, identity_name, owner_handle, gas_sponsored_usd, status, tx_ref, created_at
           FROM public.marz_identities
           WHERE owner_handle = $1
           ORDER BY created_at DESC
           LIMIT 6`,
          [ownerHandle],
        )
      : pool.query<MarzIdentityRecord>(
          `SELECT id, identity_name, owner_handle, gas_sponsored_usd, status, tx_ref, created_at
           FROM public.marz_identities
           ORDER BY created_at DESC
           LIMIT 6`,
        ),
  ])

  return {
    totalIdentities: Number(countRes.rows[0]?.count || 0),
    gasSponsoredUsd: Number(gasRes.rows[0]?.sum || 0),
    assets: assetsRes.rows.map((row) => ({
      id: row.id,
      identity: row.identity_name,
      status: row.status,
      gasSponsoredUsd: Number(row.gas_sponsored_usd || 0),
      createdAt: row.created_at,
    })),
  }
}

export async function createMarzIdentity(args: { identity: string; ownerHandle?: string | null; gasSponsoredUsd?: number }) {
  await ensureMarzTable()
  const pool = getPostgresPool()
  const normalizedIdentity = args.identity.trim().toLowerCase()
  const gasSponsoredUsd = Number.isFinite(args.gasSponsoredUsd) ? Number(args.gasSponsoredUsd) : 0

  const existing = await pool.query<MarzIdentityRecord>(
    'SELECT id, identity_name, owner_handle, gas_sponsored_usd, status, tx_ref, created_at FROM public.marz_identities WHERE identity_name = $1',
    [normalizedIdentity],
  )
  if (existing.rows[0]) {
    throw new Error('Identity already minted')
  }

  const id = randomUUID()
  const txRef = `marz_${id.slice(0, 8)}`
  await pool.query(
    `INSERT INTO public.marz_identities (id, identity_name, owner_handle, gas_sponsored_usd, status, tx_ref)
     VALUES ($1, $2, $3, $4, 'minted', $5)`,
    [id, normalizedIdentity, args.ownerHandle || null, gasSponsoredUsd, txRef],
  )

  return {
    id,
    identity: normalizedIdentity,
    gasSponsoredUsd,
    status: 'minted',
    txRef,
  }
}