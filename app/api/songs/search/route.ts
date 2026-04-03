import { NextResponse } from 'next/server'
import { repoSearchSongs } from '@/lib/data/repository'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') ?? ''
  const results = await repoSearchSongs(q)
  return NextResponse.json({ results })
}
