'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { Github } from 'lucide-react'

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

export function SignUpClient({
  callbackUrl,
  googleConfigured,
  githubConfigured,
  emailSignupAvailable,
  authSecretOk,
}: {
  callbackUrl: string
  googleConfigured: boolean
  githubConfigured: boolean
  emailSignupAvailable: boolean
  authSecretOk: boolean
}) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setBusy(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      })
      const json = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(json.error ?? 'Could not create account')
        return
      }
      const signInRes = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
        callbackUrl,
      })
      if (signInRes?.error) {
        setError('Account created — sign in with your email and password.')
        return
      }
      if (signInRes?.url) {
        window.location.href = signInRes.url
        return
      }
      window.location.href = callbackUrl
    } catch {
      setError('Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  const oauthAny = googleConfigured || githubConfigured

  return (
    <div className="max-w-md mx-auto py-16 px-4 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2 text-center"
      >
        <h1 className="text-3xl font-bold">Create account</h1>
        <p className="text-muted-foreground text-pretty">
          New here? We&apos;ll create your profile the first time. You can use Google, GitHub, or email
          and password.
        </p>
      </motion.div>

      {!authSecretOk && (
        <p className="text-sm text-amber-600 dark:text-amber-400 text-pretty text-center">
          Set <code className="text-xs bg-secondary/80 px-1 rounded">AUTH_SECRET</code> in your environment
          and restart the dev server.
        </p>
      )}

      {oauthAny && authSecretOk && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex flex-col gap-3"
        >
          {googleConfigured && (
            <button
              type="button"
              onClick={() => signIn('google', { callbackUrl })}
              className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl border border-border bg-background font-medium hover:bg-secondary/50 transition-colors"
            >
              <GoogleIcon className="w-5 h-5" />
              Continue with Google
            </button>
          )}
          {githubConfigured && (
            <button
              type="button"
              onClick={() => signIn('github', { callbackUrl })}
              className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
            >
              <Github className="w-5 h-5" />
              Continue with GitHub
            </button>
          )}
        </motion.div>
      )}

      {oauthAny && emailSignupAvailable && authSecretOk && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wide">
            <span className="bg-background px-3 text-muted-foreground">Or sign up with email</span>
          </div>
        </div>
      )}

      {emailSignupAvailable && authSecretOk ? (
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="space-y-2 text-left">
            <label className="text-sm font-medium text-muted-foreground">Username</label>
            <input
              type="text"
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 outline-none focus:border-primary/50"
              placeholder="How you appear on comments"
            />
          </div>
          <div className="space-y-2 text-left">
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 outline-none focus:border-primary/50"
            />
          </div>
          <div className="space-y-2 text-left">
            <label className="text-sm font-medium text-muted-foreground">Password</label>
            <input
              type="password"
              required
              autoComplete="new-password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 outline-none focus:border-primary/50"
              placeholder="At least 8 characters"
            />
          </div>
          <div className="space-y-2 text-left">
            <label className="text-sm font-medium text-muted-foreground">Confirm password</label>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 outline-none focus:border-primary/50"
            />
          </div>
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full px-5 py-3 rounded-xl bg-primary text-primary-foreground font-medium disabled:opacity-50"
          >
            {busy ? 'Creating…' : 'Create account'}
          </button>
        </motion.form>
      ) : !emailSignupAvailable ? (
        <p className="text-sm text-muted-foreground text-center text-pretty">
          Email sign-up needs a database. Set <code className="text-xs bg-secondary/80 px-1 rounded">DATABASE_URL</code>{' '}
          or use Google / GitHub above.
        </p>
      ) : null}

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href={`/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
      <Link href="/" className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
        Back to home
      </Link>
    </div>
  )
}
