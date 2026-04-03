import { SignUpClient } from '@/app/signup/signup-client'

export default async function SignUpPage({
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
  const emailSignupAvailable = Boolean(process.env.DATABASE_URL?.trim())

  return (
    <SignUpClient
      callbackUrl={callbackUrl}
      googleConfigured={googleConfigured}
      githubConfigured={githubConfigured}
      emailSignupAvailable={emailSignupAvailable}
      authSecretOk={authSecretOk}
    />
  )
}
