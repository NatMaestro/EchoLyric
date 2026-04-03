import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { repoGetUserById } from '@/lib/data/repository'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ user: null })
  }

  const profile = await repoGetUserById(session.user.id)
  if (profile) {
    return NextResponse.json({ user: profile })
  }

  return NextResponse.json({
    user: {
      id: session.user.id,
      username: session.user.name ?? 'Contributor',
      email: session.user.email ?? '',
      avatar: session.user.image ?? '/avatars/default.png',
      contributions: 0,
      badges: [] as string[],
      joinedAt: '',
      role: session.user.role,
    },
  })
}
