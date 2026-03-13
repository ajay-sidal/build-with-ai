import { Pool } from 'pg'

let pool: Pool | null = null

export function getPostgresPool() {
  if (pool) return pool

  const connectionString = (process.env.DATABASE_URL || '').trim()
  if (!connectionString) {
    throw new Error('Missing DATABASE_URL')
  }

  pool = new Pool({ connectionString, max: 5 })
  // Example: ensure index on users.email for fast lookup
  pool.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)')
  return pool
}
