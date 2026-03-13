import { randomBytes, randomUUID, createHmac } from 'node:crypto'
import { getPostgresPool } from './postgres'

const KEYS_TABLE = 'public.developer_keys'
const LOGS_TABLE = 'public.api_logs'

export type DeveloperKeyStatus = 'ACTIVE' | 'REVOKED'

export type DeveloperKeyRow = {
  id: string
  user_id: string
  api_key_hash: string
  key_hint: string
  created_at: string
  status: DeveloperKeyStatus
}

export type ApiUsageRow = {
  count: string
}

function getPepper(): string {
  const pepper = (process.env.DEVELOPER_KEY_PEPPER || '').trim()
  if (pepper) return pepper

  // If not explicitly set, derive a stable secret from DATABASE_URL.
  // This keeps hashes secret in production without requiring additional env wiring.
  const dbUrl = (process.env.DATABASE_URL || '').trim()
  if (dbUrl) {
    return createHmac('sha256', 'bwai:developer-key-pepper').update(dbUrl).digest('hex')
  }

  if (process.env.NODE_ENV === 'production') throw new Error('Missing DATABASE_URL')
  return 'dev-pepper'
}

export function hashDeveloperKey(apiKey: string): string {
  const pepper = getPepper()
  return createHmac('sha256', pepper).update(apiKey).digest('hex')
}

export function generateDeveloperApiKey(): { apiKey: string; hint: string } {
  // 24 bytes => 32 chars base64url.
  const apiKey = randomBytes(24).toString('base64url')
  return { apiKey, hint: apiKey.slice(0, 4) }
}

async function ensureTables() {
  const pool = getPostgresPool()
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${KEYS_TABLE} (
      id uuid PRIMARY KEY,
      user_id text NOT NULL,
      api_key_hash text NOT NULL UNIQUE,
      key_hint text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      status text NOT NULL DEFAULT 'ACTIVE'
    );
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${LOGS_TABLE} (
      id bigserial PRIMARY KEY,
      key_id uuid,
      user_id text,
      endpoint text,
      method text,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `)

  await pool.query(`CREATE INDEX IF NOT EXISTS api_logs_key_id_created_at_idx ON ${LOGS_TABLE} (key_id, created_at DESC);`)
}

export async function createDeveloperKey(args: { userId: string }): Promise<{ id: string; apiKey: string; hint: string }> {
  const userId = (args.userId || '').trim()
  if (!userId) throw new Error('Missing userId')

  await ensureTables()
  const { apiKey, hint } = generateDeveloperApiKey()
  const apiKeyHash = hashDeveloperKey(apiKey)

  const id = randomUUID()
  const pool = getPostgresPool()
  await pool.query(
    `INSERT INTO ${KEYS_TABLE} (id, user_id, api_key_hash, key_hint, status) VALUES ($1,$2,$3,$4,'ACTIVE')`,
    [id, userId, apiKeyHash, hint],
  )

  return { id, apiKey, hint }
}

export async function listDeveloperKeys(args: { userId: string }): Promise<Array<Pick<DeveloperKeyRow, 'id' | 'key_hint' | 'created_at' | 'status'>>> {
  const userId = (args.userId || '').trim()
  if (!userId) return []

  await ensureTables()
  const pool = getPostgresPool()
  const { rows } = await pool.query<DeveloperKeyRow>(
    `SELECT id, key_hint, created_at, status FROM ${KEYS_TABLE} WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId],
  )
  return rows
}

export async function revokeDeveloperKey(args: { userId: string; id: string }): Promise<boolean> {
  const userId = (args.userId || '').trim()
  const id = (args.id || '').trim()
  if (!userId || !id) return false

  await ensureTables()
  const pool = getPostgresPool()
  const res = await pool.query(`UPDATE ${KEYS_TABLE} SET status = 'REVOKED' WHERE user_id = $1 AND id = $2 AND status = 'ACTIVE'`, [userId, id])
  return (res.rowCount || 0) > 0
}

export async function findDeveloperKeyByApiKey(apiKey: string): Promise<{ id: string; userId: string } | null> {
  const trimmed = (apiKey || '').trim()
  if (!trimmed) return null

  await ensureTables()
  const pool = getPostgresPool()
  const apiKeyHash = hashDeveloperKey(trimmed)
  const { rows } = await pool.query<Pick<DeveloperKeyRow, 'id' | 'user_id' | 'status'>>(
    `SELECT id, user_id, status FROM ${KEYS_TABLE} WHERE api_key_hash = $1 LIMIT 1`,
    [apiKeyHash],
  )

  const row = rows[0]
  if (!row) return null
  if (row.status !== 'ACTIVE') return null
  return { id: row.id, userId: row.user_id }
}

export async function logApiUsage(args: { keyId: string | null; userId: string | null; endpoint: string; method: string }) {
  await ensureTables()
  const pool = getPostgresPool()
  await pool.query(
    `INSERT INTO ${LOGS_TABLE} (key_id, user_id, endpoint, method) VALUES ($1,$2,$3,$4)`,
    [args.keyId || null, args.userId || null, args.endpoint, args.method],
  )
}

export async function getApiUsageCount(args: { userId: string; windowHours?: number }): Promise<number> {
  const userId = (args.userId || '').trim()
  if (!userId) return 0

  await ensureTables()
  const pool = getPostgresPool()
  const hours = Math.max(1, Math.floor(args.windowHours || 24))
  const { rows } = await pool.query<ApiUsageRow>(
    `SELECT COUNT(*)::text AS count FROM ${LOGS_TABLE} WHERE user_id = $1 AND created_at >= (now() - ($2::text || ' hours')::interval)`,
    [userId, String(hours)],
  )
  return Number(rows?.[0]?.count || 0)
}
