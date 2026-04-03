import { NextResponse } from 'next/server'
import { repoGetLyrics } from '@/lib/data/repository'

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const lyrics = await repoGetLyrics(id)
  return NextResponse.json({ lyrics })
}
