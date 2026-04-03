import { NextResponse } from 'next/server'
import { repoGetTrendingRecent } from '@/lib/data/repository'

export async function GET() {
  const { recentlyAdded } = await repoGetTrendingRecent()
  return NextResponse.json({ songs: recentlyAdded })
}
