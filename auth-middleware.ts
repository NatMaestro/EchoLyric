import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import type { NextAuthConfig } from 'next-auth'
import { upsertGitHubUser, upsertOAuthUser } from '@/lib/auth/sync-user'
import type { AppUserRole } from '@/lib/auth/roles'

/**
 * Edge-safe NextAuth export for `middleware.ts`.
 *
 * IMPORTANT: This file must not import anything that eventually pulls in
 * `lib/auth/password.ts` (Node `crypto`), otherwise Edge runtime bundling fails.
 */

const providers = [] as NextAuthConfig['providers']

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    })
  )
}

if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    })
  )
}

const authConfig = {
  providers,
  trustHost: true,
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.provider === 'github' && profile && typeof profile === 'object') {
        const p = profile as Record<string, unknown>
        const sub =
          typeof p.sub === 'string' ? p.sub : p.id != null ? String(p.id) : null

        if (sub) {
          const email = typeof p.email === 'string' ? p.email : null
          const name = typeof p.name === 'string' ? p.name : null
          const picture =
            typeof p.avatar_url === 'string'
              ? p.avatar_url
              : typeof p.picture === 'string'
                ? p.picture
                : typeof p.image === 'string'
                  ? p.image
                  : null

          const { id, role } = await upsertGitHubUser({
            githubId: sub,
            name,
            email,
            image: picture,
          })
          token.appUserId = id
          token.role = role
        }
      }

      if (account?.provider === 'google' && profile && typeof profile === 'object') {
        const p = profile as Record<string, unknown>
        const sub = typeof p.sub === 'string' ? p.sub : null
        if (sub) {
          const { id, role } = await upsertOAuthUser({
            provider: 'google',
            providerAccountId: sub,
            email: typeof p.email === 'string' ? p.email : null,
            name: typeof p.name === 'string' ? p.name : null,
            image: typeof p.picture === 'string' ? p.picture : null,
          })
          token.appUserId = id
          token.role = role
        }
      }

      // Keep any existing role/appUserId already present in the token.
      return token
    },
    async session({ session, token }) {
      if (token.appUserId) {
        return {
          ...session,
          user: {
            ...session.user,
            id: token.appUserId as string,
            role: (token.role as AppUserRole) ?? 'user',
          },
        }
      }
      return session
    },
  },
  pages: {
    signIn: '/signin',
  },
} satisfies NextAuthConfig

/**
 * NextAuth requires a non-empty secret for cookies/JWTs.
 * If AUTH_SECRET is missing in dev, we use a dev-only fallback.
 */
function resolveAuthSecret(): string | undefined {
  const fromEnv = process.env.AUTH_SECRET?.trim()
  if (fromEnv) return fromEnv
  if (process.env.NODE_ENV === 'development') {
    return 'echolyric-dev-only-secret-not-for-production'
  }
  return undefined
}

export const { auth } = NextAuth({
  ...authConfig,
  secret: resolveAuthSecret(),
})

