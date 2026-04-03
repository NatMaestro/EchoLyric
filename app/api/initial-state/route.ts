import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { MEMORY_SUGGESTIONS, PROFILE_ACTIVITY } from '@/lib/data/catalog'
import {
  repoGetCollections,
  repoGetCommentsRecord,
  repoGetFavoriteSongIds,
  repoGetLyricsRecord,
  repoGetTrendingRecent,
  repoGetUserById,
} from '@/lib/data/repository'
import { getDemoUser } from '@/lib/data/server-state'
import { isDatabaseConfigured } from '@/lib/db'

export async function GET() {
  const session = await auth()
  const { songs, trending, recentlyAdded } = await repoGetTrendingRecent()
  const [collections, lyrics, comments] = await Promise.all([
    repoGetCollections(),
    repoGetLyricsRecord(),
    repoGetCommentsRecord(session?.user?.id ?? null),
  ])

  let user = null
  let favoriteSongIds: string[] = []
  if (session?.user?.id) {
    user = await repoGetUserById(session.user.id)
    favoriteSongIds = await repoGetFavoriteSongIds(session.user.id)
  } else if (!isDatabaseConfigured()) {
    user = getDemoUser()
    favoriteSongIds = await repoGetFavoriteSongIds(user.id)
  }

  return NextResponse.json({
    songs,
    trending,
    recentlyAdded,
    collections,
    lyrics,
    comments,
    user,
    profileActivity: PROFILE_ACTIVITY,
    memorySuggestions: MEMORY_SUGGESTIONS,
    favoriteSongIds,
  })
}
