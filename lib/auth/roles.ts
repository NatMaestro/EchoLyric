/**
 * Stored on `users.role` (Postgres) and mirrored on the session JWT.
 * Guest is implicit (no session); signed-in users default to `user`.
 */
export type AppUserRole = 'user' | 'contributor' | 'curator' | 'admin'

const REVIEW_ROLES: AppUserRole[] = ['admin', 'curator']

export function normalizeDbRole(value: string | null | undefined): AppUserRole {
  if (value === 'admin' || value === 'curator' || value === 'contributor') {
    return value
  }
  return 'user'
}

export function canReviewLyricSubmissions(role: AppUserRole | undefined): boolean {
  return role != null && REVIEW_ROLES.includes(role)
}

/** Used when merging OAuth sync with an existing DB row. */
export function resolveRoleAfterOAuth(
  wantsAdmin: boolean,
  wantsCurator: boolean,
  existingRoleRaw: string
): AppUserRole {
  const existing = normalizeDbRole(existingRoleRaw)
  if (wantsAdmin || existing === 'admin') return 'admin'
  if (wantsCurator || existing === 'curator') return 'curator'
  if (existing === 'contributor') return 'contributor'
  return 'user'
}
