import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { repoSaveContribution } from '@/lib/data/repository'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Sign in to contribute lyrics' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { id, createdAt } = await repoSaveContribution(session.user.id, body)

  return NextResponse.json({
    ok: true,
    message: 'Submission received for review',
    id,
    receivedAt: createdAt,
  })
}
