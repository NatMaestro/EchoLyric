import { eq } from 'drizzle-orm'
import { users } from '@/lib/db/schema'
import { getDb } from '@/lib/db'
import { hashPassword, verifyPassword } from '@/lib/auth/password'
import type { AppUserRole } from '@/lib/auth/roles'
import { resolveRoleAfterOAuth } from '@/lib/auth/roles'

function parseAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS
  if (!raw?.trim()) return []
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

function parseCuratorEmails(): string[] {
  const raw = process.env.CURATOR_EMAILS
  if (!raw?.trim()) return []
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export type CredentialsUser = {
  id: string
  email: string
  username: string
  avatar: string
  role: AppUserRole
}

export async function registerEmailUser(params: {
  email: string
  username: string
  password: string
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const db = getDb()
  if (!db) {
    return { ok: false, error: 'Database is required for email sign-up' }
  }

  const emailLower = params.email.trim().toLowerCase()
  const username = params.username.trim()
  if (!emailLower.includes('@')) {
    return { ok: false, error: 'Enter a valid email address' }
  }
  if (username.length < 2) {
    return { ok: false, error: 'Username must be at least 2 characters' }
  }
  if (params.password.length < 8) {
    return { ok: false, error: 'Password must be at least 8 characters' }
  }

  const [dup] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, emailLower))
    .limit(1)

  if (dup) {
    return { ok: false, error: 'An account with this email already exists' }
  }

  const passwordHash = await hashPassword(params.password)
  const id = `u_${crypto.randomUUID()}`
  const joinedAt = new Date().toISOString().split('T')[0]
  const adminEmails = parseAdminEmails()
  const curatorEmails = parseCuratorEmails()
  const role = resolveRoleAfterOAuth(
    adminEmails.includes(emailLower),
    curatorEmails.includes(emailLower),
    'user'
  )

  await db.insert(users).values({
    id,
    username,
    email: emailLower,
    avatar: '/avatars/default.png',
    contributions: 0,
    badges: [],
    joinedAt,
    githubId: null,
    googleId: null,
    passwordHash,
    role,
  })

  return { ok: true }
}

export async function verifyCredentialsUser(
  email: string,
  password: string
): Promise<CredentialsUser | null> {
  const db = getDb()
  if (!db) return null

  const emailLower = email.trim().toLowerCase()
  const [row] = await db
    .select()
    .from(users)
    .where(eq(users.email, emailLower))
    .limit(1)

  if (!row?.passwordHash) return null

  const valid = await verifyPassword(password, row.passwordHash)
  if (!valid) return null

  return {
    id: row.id,
    email: row.email,
    username: row.username,
    avatar: row.avatar,
    role: row.role as AppUserRole,
  }
}
