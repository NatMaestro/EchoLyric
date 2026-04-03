import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { repoToggleCommentLike } from '@/lib/data/repository'

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string; commentId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Sign in to like comments' }, { status: 401 })
  }
  const { id: songId, commentId } = await context.params
  const result = await repoToggleCommentLike(songId, commentId, session.user.id)
  if (!result) {
    return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
  }
  return NextResponse.json(result)
}
