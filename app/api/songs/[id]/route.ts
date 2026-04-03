import { NextResponse } from 'next/server'
import { repoGetSong } from '@/lib/data/repository'

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const song = await repoGetSong(id)
  if (!song) {
    return NextResponse.json({ error: 'Song not found' }, { status: 404 })
  }
  return NextResponse.json(song)
}
