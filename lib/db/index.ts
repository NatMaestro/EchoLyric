import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '@/lib/db/schema'

export type Database = ReturnType<typeof drizzle<typeof schema>>

let instance: Database | null = null

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim())
}

/** Neon HTTP driver — suitable for Netlify serverless and short-lived Next.js routes. */
export function getDb(): Database | null {
  if (!isDatabaseConfigured()) return null
  if (!instance) {
    instance = drizzle(neon(process.env.DATABASE_URL!), { schema })
  }
  return instance
}
