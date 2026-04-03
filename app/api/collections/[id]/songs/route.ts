import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { repoAddSongToCollection, repoGetCollection } from '@/lib/data/repository'

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Sign in to update collections' }, { status: 401 })
  }
  const { id: collectionId } = await context.params
  const body = (await request.json().catch(() => null)) as { songId?: string }
  if (!body?.songId?.trim()) {
    return NextResponse.json({ error: 'songId is required' }, { status: 400 })
  }
  const result = await repoAddSongToCollection(collectionId, body.songId.trim(), session.user.id)
  if (!result.ok) {
    const forbidden = result.error?.toLowerCase().includes('only')
    return NextResponse.json(
      { error: result.error ?? 'Failed' },
      { status: forbidden ? 403 : 400 }
    )
  }
  const updated = await repoGetCollection(collectionId)
  return NextResponse.json({ ok: true, collection: updated })
}
