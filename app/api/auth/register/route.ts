import { NextResponse } from 'next/server'
import { registerEmailUser } from '@/lib/auth/email-account'

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    email?: string
    username?: string
    password?: string
  } | null

  if (!body?.email?.trim() || !body.username?.trim() || !body.password) {
    return NextResponse.json({ error: 'Email, username, and password are required' }, { status: 400 })
  }

  const result = await registerEmailUser({
    email: body.email,
    username: body.username,
    password: body.password,
  })

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
