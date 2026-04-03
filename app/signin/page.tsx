import { SignInClient } from '@/app/signin/signin-client'

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>
}) {
  const sp = await searchParams
  const callbackUrl = sp.callbackUrl?.startsWith('/') ? sp.callbackUrl : '/'
  const authSecretOk = Boolean(process.env.AUTH_SECRET?.trim())
  const googleConfigured = Boolean(
    process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
  )
  const githubConfigured = Boolean(
    process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET
  )
  const emailSignInAvailable = Boolean(process.env.DATABASE_URL?.trim())

  return (
    <SignInClient
      callbackUrl={callbackUrl}
      googleConfigured={googleConfigured}
      githubConfigured={githubConfigured}
      emailSignInAvailable={emailSignInAvailable}
      authSecretOk={authSecretOk}
    />
  )
}
