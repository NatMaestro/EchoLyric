import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { repoAddFavorite, repoGetFavoriteSongIds, repoRemoveFavorite } from '@/lib/data/repository'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ songIds: [] as string[] })
  }
  const songIds = await repoGetFavoriteSongIds(session.user.id)
  return NextResponse.json({ songIds })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Sign in to save favorites' }, { status: 401 })
  }
  const body = (await request.json().catch(() => null)) as { songId?: string }
  if (!body?.songId?.trim()) {
    return NextResponse.json({ error: 'songId is required' }, { status: 400 })
  }
  const ok = await repoAddFavorite(session.user.id, body.songId.trim())
  if (!ok) {
    return NextResponse.json({ error: 'Song not found' }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const songId = new URL(request.url).searchParams.get('songId')?.trim()
  if (!songId) {
    return NextResponse.json({ error: 'songId query required' }, { status: 400 })
  }
  await repoRemoveFavorite(session.user.id, songId)
  return NextResponse.json({ ok: true })
}
