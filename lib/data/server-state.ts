import type { Collection, Comment, Lyrics, Song, User } from '@/lib/types/models'
import {
  DEMO_USER,
  SEED_COLLECTIONS,
  SEED_COMMENTS,
  SEED_LYRICS,
  SEED_SONGS,
  searchSongsWithLyrics,
  recentlyAddedFromSongs,
  trendingFromSongs,
} from '@/lib/data/catalog'

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T
}

let songs: Song[] = clone(SEED_SONGS)
let collections: Collection[] = clone(SEED_COLLECTIONS)
let lyricsBySongId: Record<string, Lyrics> = clone(SEED_LYRICS)
let commentsBySongId: Record<string, Comment[]> = clone(SEED_COMMENTS)

const favoriteSongIdsByUser = new Map<string, Set<string>>()
/** commentId → users who liked (for like count we mutate comment.likes on toggle) */
const commentLikedBy = new Map<string, Set<string>>()

export function getSongs(): Song[] {
  return songs
}

export function getSongById(id: string): Song | undefined {
  return songs.find((s) => s.id === id)
}

export function getTrendingSongs(): Song[] {
  return trendingFromSongs(songs)
}

export function getRecentlyAddedSongs(): Song[] {
  return recentlyAddedFromSongs(songs)
}

export function searchSongs(query: string): Song[] {
  return searchSongsWithLyrics(songs, lyricsBySongId, query)
}

export function addSong(song: Song): Song {
  songs = [...songs, song]
  return song
}

export function getCollections(): Collection[] {
  return collections
}

export function getCollectionById(id: string): Collection | undefined {
  return collections.find((c) => c.id === id)
}

export function addCollection(collection: Collection): Collection {
  collections = [...collections, collection]
  return collection
}

export function getLyricsForSong(songId: string): Lyrics | null {
  return lyricsBySongId[songId] ?? null
}

export function getCommentsForSong(songId: string): Comment[] {
  return commentsBySongId[songId] ?? []
}

export function addCommentToSong(songId: string, comment: Comment): Comment {
  const existing = commentsBySongId[songId] ?? []
  commentsBySongId = {
    ...commentsBySongId,
    [songId]: [comment, ...existing],
  }
  return comment
}

export function getDemoUser(): User {
  return DEMO_USER
}

export function getLyricsRecord(): Record<string, Lyrics> {
  return { ...lyricsBySongId }
}

export function getCommentsRecord(viewerUserId: string | null): Record<string, Comment[]> {
  const out: Record<string, Comment[]> = {}
  for (const [songId, list] of Object.entries(commentsBySongId)) {
    out[songId] = list.map((c) => ({
      ...c,
      likedByMe: viewerUserId ? (commentLikedBy.get(c.id)?.has(viewerUserId) ?? false) : false,
    }))
  }
  return out
}

export function getFavoriteSongIds(userId: string): string[] {
  return [...(favoriteSongIdsByUser.get(userId) ?? [])]
}

export function addFavorite(userId: string, songId: string): boolean {
  if (!songs.some((s) => s.id === songId)) return false
  let set = favoriteSongIdsByUser.get(userId)
  if (!set) {
    set = new Set()
    favoriteSongIdsByUser.set(userId, set)
  }
  set.add(songId)
  return true
}

export function removeFavorite(userId: string, songId: string): void {
  favoriteSongIdsByUser.get(userId)?.delete(songId)
}

export function addSongToCollection(
  collectionId: string,
  songId: string,
  userId: string
): { ok: true } | { ok: false; error: string } {
  const col = collections.find((c) => c.id === collectionId)
  if (!col) return { ok: false, error: 'Collection not found' }
  if (col.ownerUserId != null && col.ownerUserId !== userId) {
    return { ok: false, error: 'You can only edit your own collections' }
  }
  if (!songs.some((s) => s.id === songId)) return { ok: false, error: 'Song not found' }
  if (col.songIds.includes(songId)) return { ok: true }
  collections = collections.map((c) =>
    c.id === collectionId ? { ...c, songIds: [...c.songIds, songId] } : c
  )
  return { ok: true }
}

export function toggleCommentLike(
  songId: string,
  commentId: string,
  userId: string
): { likes: number; likedByMe: boolean } | null {
  const list = commentsBySongId[songId]
  const c = list?.find((x) => x.id === commentId)
  if (!c) return null
  let likers = commentLikedBy.get(commentId)
  if (!likers) {
    likers = new Set()
    commentLikedBy.set(commentId, likers)
  }
  if (likers.has(userId)) {
    likers.delete(userId)
    c.likes = Math.max(0, c.likes - 1)
    return { likes: c.likes, likedByMe: false }
  }
  likers.add(userId)
  c.likes += 1
  return { likes: c.likes, likedByMe: true }
}
