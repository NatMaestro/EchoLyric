import { NextResponse } from 'next/server'
import { repoGetCollection } from '@/lib/data/repository'

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const collection = await repoGetCollection(id)
  if (!collection) {
    return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
  }
  return NextResponse.json(collection)
}
