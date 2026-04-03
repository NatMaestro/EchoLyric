import { NextResponse } from 'next/server'
import { filterSuggestions } from '@/lib/data/catalog'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') ?? ''
  return NextResponse.json({ suggestions: filterSuggestions(q) })
}
