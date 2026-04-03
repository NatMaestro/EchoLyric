import {
  DEMO_USER,
  recentlyAddedFromSongs,
  trendingFromSongs,
} from '@/lib/data/catalog'
import * as dbq from '@/lib/db/queries'
import { getDb, isDatabaseConfigured } from '@/lib/db/index'
import type { Collection, Comment, Lyrics, Song, User } from '@/lib/types/models'
import * as memory from '@/lib/data/server-state'

async function useDb<T>(fn: (db: NonNullable<ReturnType<typeof getDb>>) => Promise<T>): Promise<T> {
  const db = getDb()
  if (!db) throw new Error('Database not configured')
  return fn(db)
}

export function usingPostgres(): boolean {
  return isDatabaseConfigured()
}

export async function repoGetUserById(id: string): Promise<User | null> {
  if (!isDatabaseConfigured()) {
    if (id === memory.getDemoUser().id) return memory.getDemoUser()
    return {
      id,
      username: 'Contributor',
      email: '',
      avatar: '/avatars/default.png',
      contributions: 0,
      badges: [],
      joinedAt: '',
      role: 'user',
    }
  }
  const db = getDb()
  if (!db) return null
  return dbq.dbGetUserById(db, id)
}

export async function repoGetSongs(): Promise<Song[]> {
  if (!isDatabaseConfigured()) return memory.getSongs()
  return useDb((db) => dbq.dbListSongsOrdered(db))
}

export async function repoGetSong(id: string): Promise<Song | undefined> {
  if (!isDatabaseConfigured()) return memory.getSongById(id)
  return useDb((db) => dbq.dbGetSong(db, id))
}

export async function repoGetTrendingRecent(): Promise<{
  songs: Song[]
  trending: Song[]
  recentlyAdded: Song[]
}> {
  if (!isDatabaseConfigured()) {
    const songs = memory.getSongs()
    return {
      songs,
      trending: trendingFromSongs(songs),
      recentlyAdded: recentlyAddedFromSongs(songs),
    }
  }
  return useDb((db) => dbq.dbTrendingAndRecent(db))
}

export async function repoSearchSongs(query: string): Promise<Song[]> {
  if (!isDatabaseConfigured()) return memory.searchSongs(query)
  return useDb((db) => dbq.dbSearchSongs(db, query))
}

export async function repoAddSong(song: Song): Promise<Song> {
  if (!isDatabaseConfigured()) return memory.addSong(song)
  return useDb((db) => dbq.dbInsertSong(db, song))
}

export async function repoGetCollections(): Promise<Collection[]> {
  if (!isDatabaseConfigured()) return memory.getCollections()
  return useDb((db) => dbq.dbListCollections(db))
}

export async function repoGetCollection(id: string): Promise<Collection | undefined> {
  if (!isDatabaseConfigured()) return memory.getCollectionById(id)
  return useDb((db) => dbq.dbGetCollection(db, id))
}

export async function repoAddCollection(collection: Collection): Promise<Collection> {
  if (!isDatabaseConfigured()) return memory.addCollection(collection)
  await useDb((db) => dbq.dbInsertCollection(db, collection))
  return collection
}

export async function repoGetLyrics(songId: string): Promise<Lyrics | null> {
  if (!isDatabaseConfigured()) return memory.getLyricsForSong(songId)
  return useDb((db) => dbq.dbGetLyrics(db, songId))
}

export async function repoGetLyricsRecord(): Promise<Record<string, Lyrics>> {
  if (!isDatabaseConfigured()) return memory.getLyricsRecord()
  return useDb((db) => dbq.dbGetAllLyrics(db))
}

export async function repoGetComments(songId: string): Promise<Comment[]> {
  if (!isDatabaseConfigured()) return memory.getCommentsForSong(songId)
  return useDb((db) => dbq.dbGetCommentsForSong(db, songId))
}

export async function repoGetCommentsRecord(
  viewerUserId: string | null
): Promise<Record<string, Comment[]>> {
  if (!isDatabaseConfigured()) return memory.getCommentsRecord(viewerUserId)
  return useDb((db) => dbq.dbGetAllComments(db, viewerUserId))
}

export async function repoAddComment(songId: string, comment: Comment): Promise<Comment> {
  if (!isDatabaseConfigured()) return memory.addCommentToSong(songId, comment)
  await useDb((db) => dbq.dbInsertComment(db, songId, comment))
  return comment
}

export async function repoGetDemoUser(): Promise<User> {
  if (!isDatabaseConfigured()) return memory.getDemoUser()
  const db = getDb()
  if (!db) return DEMO_USER
  const user = await dbq.dbGetDemoUser(db)
  return user ?? DEMO_USER
}

export async function repoSaveContribution(
  userId: string,
  payload: unknown
): Promise<{ id: string; createdAt: string }> {
  const id = `sub-${Date.now()}`
  const createdAt = new Date().toISOString()
  const record =
    payload && typeof payload === 'object' && !Array.isArray(payload)
      ? (payload as Record<string, unknown>)
      : { value: payload }

  if (isDatabaseConfigured()) {
    const db = getDb()
    if (db) {
      await dbq.dbInsertContribution(db, id, userId, record, createdAt)
    }
  }
  return { id, createdAt }
}

export async function repoListPendingContributions(): Promise<dbq.PendingContributionRow[]> {
  if (!isDatabaseConfigured()) return []
  return useDb((db) => dbq.dbListPendingContributions(db))
}

export async function repoUpdateSubmissionStatus(
  id: string,
  status: 'approved' | 'rejected',
  reviewedByUserId: string
): Promise<boolean> {
  if (!isDatabaseConfigured()) return false
  return useDb((db) => dbq.dbUpdateSubmissionStatus(db, id, status, reviewedByUserId))
}

/** Approve/reject with merge into `song_lyrics` when approved (Postgres only). */
export async function repoReviewLyricSubmission(
  submissionId: string,
  status: 'approved' | 'rejected',
  reviewedByUserId: string
): Promise<{ ok: boolean; error?: string; songId?: string }> {
  if (!isDatabaseConfigured()) {
    return { ok: false, error: 'Database not configured' }
  }
  return useDb((db) => dbq.dbReviewLyricSubmission(db, submissionId, status, reviewedByUserId))
}

export async function repoGetFavoriteSongIds(userId: string): Promise<string[]> {
  if (!isDatabaseConfigured()) return memory.getFavoriteSongIds(userId)
  return useDb((db) => dbq.dbListFavoriteSongIds(db, userId))
}

export async function repoAddFavorite(userId: string, songId: string): Promise<boolean> {
  if (!isDatabaseConfigured()) return memory.addFavorite(userId, songId)
  return useDb((db) => dbq.dbAddUserFavorite(db, userId, songId))
}

export async function repoRemoveFavorite(userId: string, songId: string): Promise<void> {
  if (!isDatabaseConfigured()) {
    memory.removeFavorite(userId, songId)
    return
  }
  await useDb((db) => dbq.dbRemoveUserFavorite(db, userId, songId))
}

export async function repoAddSongToCollection(
  collectionId: string,
  songId: string,
  userId: string
): Promise<{ ok: boolean; error?: string }> {
  if (!isDatabaseConfigured()) {
    return memory.addSongToCollection(collectionId, songId, userId)
  }
  return useDb(async (db) => {
    const col = await dbq.dbGetCollection(db, collectionId)
    if (!col) return { ok: false, error: 'Collection not found' }
    if (col.ownerUserId != null && col.ownerUserId !== userId) {
      return { ok: false, error: 'You can only edit your own collections' }
    }
    const r = await dbq.dbInsertCollectionSong(db, collectionId, songId)
    return r.ok ? { ok: true } : { ok: false, error: r.error }
  })
}

export async function repoToggleCommentLike(
  songId: string,
  commentId: string,
  userId: string
): Promise<{ likes: number; likedByMe: boolean } | null> {
  if (!isDatabaseConfigured()) {
    return memory.toggleCommentLike(songId, commentId, userId)
  }
  return useDb((db) => dbq.dbToggleCommentLike(db, songId, commentId, userId))
}
