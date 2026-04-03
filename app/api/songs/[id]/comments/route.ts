import { NextResponse } from 'next/server'
import type { Comment } from '@/lib/types/models'
import { auth } from '@/auth'
import { repoAddComment, repoGetComments } from '@/lib/data/repository'

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const comments = await repoGetComments(id)
  return NextResponse.json({ comments })
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Sign in to comment' }, { status: 401 })
  }

  const { id: songId } = await context.params
  const body = (await request.json()) as { text?: string }
  if (!body.text?.trim()) {
    return NextResponse.json({ error: 'text is required' }, { status: 400 })
  }

  const comment: Comment = {
    id: `c-${Date.now()}`,
    userId: session.user.id,
    username: session.user.name?.trim() || 'Contributor',
    avatar: session.user.image?.trim() || '/avatars/default.png',
    text: body.text.trim(),
    createdAt: new Date().toISOString().split('T')[0],
    likes: 0,
  }

  const saved = await repoAddComment(songId, comment)
  return NextResponse.json({ comment: { ...saved, likedByMe: false } }, { status: 201 })
}
