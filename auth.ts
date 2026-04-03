import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import type { NextAuthConfig } from 'next-auth'
import { upsertGitHubUser, upsertOAuthUser } from '@/lib/auth/sync-user'
import { verifyCredentialsUser } from '@/lib/auth/email-account'
import type { AppUserRole } from '@/lib/auth/roles'

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

providers.push(
  Credentials({
    name: 'Email',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      const email = typeof credentials?.email === 'string' ? credentials.email : ''
      const password = typeof credentials?.password === 'string' ? credentials.password : ''
      if (!email.trim() || !password) return null
      const user = await verifyCredentialsUser(email, password)
      if (!user) return null
      return {
        id: user.id,
        email: user.email,
        name: user.username,
        image: user.avatar,
        role: user.role,
      }
    },
  })
)

export const authConfig = {
  providers,
  trustHost: true,
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user && account?.provider === 'credentials') {
        const u = user as { id: string; role?: AppUserRole }
        token.appUserId = u.id
        token.role = u.role ?? 'user'
        return token
      }

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
 * Auth.js requires a non-empty secret for cookies/JWTs. Missing `AUTH_SECRET` causes
 * ClientFetchError / "problem with the server configuration" on `/api/auth/session`.
 */
function resolveAuthSecret(): string | undefined {
  const fromEnv = process.env.AUTH_SECRET?.trim()
  if (fromEnv) return fromEnv
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      '[auth] AUTH_SECRET is missing or empty. Using a dev-only fallback. Set AUTH_SECRET in .env (run: npx auth secret)'
    )
    return 'echolyric-dev-only-secret-not-for-production'
  }
  return undefined
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: resolveAuthSecret(),
})
