import { eq } from 'drizzle-orm'
import { users } from '@/lib/db/schema'
import { getDb } from '@/lib/db'
import { resolveRoleAfterOAuth, type AppUserRole } from '@/lib/auth/roles'

export type OAuthProviderId = 'github' | 'google'

export type UpsertOAuthInput = {
  provider: OAuthProviderId
  /** Provider account id (GitHub numeric id as string, Google `sub`). */
  providerAccountId: string
  email?: string | null
  name?: string | null
  image?: string | null
}

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

function fallbackEmail(input: UpsertOAuthInput): string {
  const trimmed = input.email?.trim()
  if (trimmed) return trimmed.toLowerCase()
  if (input.provider === 'github') {
    return `${input.providerAccountId}@users.noreply.github.com`
  }
  return `google_${input.providerAccountId}@oauth.local`
}

/**
 * Creates or updates an app user from GitHub / Google OAuth.
 * ADMIN_EMAILS / CURATOR_EMAILS apply by email (case-insensitive).
 */
export async function upsertOAuthUser(input: UpsertOAuthInput): Promise<{
  id: string
  role: AppUserRole
}> {
  const emailRaw = fallbackEmail(input)
  const emailLower = emailRaw
  const adminEmails = parseAdminEmails()
  const curatorEmails = parseCuratorEmails()
  const wantsAdmin = adminEmails.includes(emailLower)
  const wantsCurator = curatorEmails.includes(emailLower)

  const db = getDb()
  if (!db) {
    const prefix = input.provider === 'github' ? 'gh' : 'go'
    return {
      id: `${prefix}_${input.providerAccountId}`,
      role: resolveRoleAfterOAuth(wantsAdmin, wantsCurator, 'user'),
    }
  }

  const providerCol =
    input.provider === 'github' ? users.githubId : users.googleId

  const [existingByProvider] = await db
    .select()
    .from(users)
    .where(eq(providerCol, input.providerAccountId))
    .limit(1)

  let existing = existingByProvider

  if (!existing && input.email?.trim()) {
    const normalized = input.email.trim().toLowerCase()
    const [byEmail] = await db.select().from(users).where(eq(users.email, normalized)).limit(1)
    if (byEmail) {
      existing = byEmail
    }
  }

  const username = input.name?.trim() || existing?.username || 'Contributor'
  const avatar = input.image?.trim() || existing?.avatar || '/avatars/default.png'

  if (existing) {
    const role = resolveRoleAfterOAuth(wantsAdmin, wantsCurator, existing.role as AppUserRole)
    await db
      .update(users)
      .set({
        username,
        email: (input.email?.trim() || existing.email).toLowerCase(),
        avatar,
        role,
        githubId:
          input.provider === 'github'
            ? input.providerAccountId
            : (existing.githubId ?? null),
        googleId:
          input.provider === 'google'
            ? input.providerAccountId
            : (existing.googleId ?? null),
      })
      .where(eq(users.id, existing.id))
    return { id: existing.id, role }
  }

  const id = `u_${crypto.randomUUID()}`
  const role = resolveRoleAfterOAuth(wantsAdmin, wantsCurator, 'user')
  const joinedAt = new Date().toISOString().split('T')[0]

  await db.insert(users).values({
    id,
    username,
    email: (input.email?.trim() || emailRaw).toLowerCase(),
    avatar,
    contributions: 0,
    badges: [],
    joinedAt,
    githubId: input.provider === 'github' ? input.providerAccountId : null,
    googleId: input.provider === 'google' ? input.providerAccountId : null,
    passwordHash: null,
    role,
  })

  return { id, role }
}

/** @deprecated Use upsertOAuthUser({ provider: 'github', ... }) */
export async function upsertGitHubUser(input: {
  githubId: string
  name?: string | null
  email?: string | null
  image?: string | null
}): Promise<{ id: string; role: AppUserRole }> {
  return upsertOAuthUser({
    provider: 'github',
    providerAccountId: input.githubId,
    email: input.email,
    name: input.name,
    image: input.image,
  })
}
