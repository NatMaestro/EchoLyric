import { sql } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { getDb, isDatabaseConfigured } from '@/lib/db'

export async function GET() {
  let database: 'up' | 'down' | 'off' = 'off'
  const db = getDb()
  if (isDatabaseConfigured() && db) {
    try {
      await db.execute(sql`select 1`)
      database = 'up'
    } catch {
      database = 'down'
    }
  }

  return NextResponse.json({
    ok: true,
    app: 'echolyric',
    timestamp: new Date().toISOString(),
    database,
  })
}
