import { NextResponse } from 'next/server'
import { repoGetTrendingRecent } from '@/lib/data/repository'

export async function GET() {
  const { trending } = await repoGetTrendingRecent()
  return NextResponse.json({ songs: trending })
}
