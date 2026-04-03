import { NextResponse } from 'next/server'
import { DEFAULT_GENRE } from '@/lib/constants/genres'
import type { Song } from '@/lib/types/models'
import { repoAddSong, repoGetSongs } from '@/lib/data/repository'

export async function GET() {
  const songs = await repoGetSongs()
  return NextResponse.json({ songs })
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<Song>
  if (!body.title?.trim() || !body.artist?.trim()) {
    return NextResponse.json({ error: 'title and artist are required' }, { status: 400 })
  }
  const song: Song = {
    id: body.id ?? `song-${Date.now()}`,
    title: body.title.trim(),
    artist: body.artist.trim(),
    year: typeof body.year === 'number' ? body.year : new Date().getFullYear(),
    genre: body.genre?.trim() || DEFAULT_GENRE,
    coverImage: body.coverImage,
    hasTranslation: Boolean(body.hasTranslation),
    contributionsCount: body.contributionsCount ?? 0,
  }
  const created = await repoAddSong(song)
  return NextResponse.json({ song: created }, { status: 201 })
}
