import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import type { Collection } from '@/lib/types/models'
import { repoAddCollection, repoGetCollections } from '@/lib/data/repository'

export async function GET() {
  const collections = await repoGetCollections()
  return NextResponse.json({ collections })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Sign in to create collections' }, { status: 401 })
  }

  const body = (await request.json()) as Partial<Collection>
  if (!body.name?.trim()) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 })
  }

  const collection: Collection = {
    id: body.id ?? `col-${Date.now()}`,
    name: body.name.trim(),
    description: body.description,
    coverImage: body.coverImage,
    songIds: Array.isArray(body.songIds) ? body.songIds : [],
    createdAt: body.createdAt ?? new Date().toISOString().split('T')[0],
    isPublic: body.isPublic ?? true,
    ownerUserId: session.user.id,
  }

  const created = await repoAddCollection(collection)
  return NextResponse.json({ collection: created }, { status: 201 })
}
