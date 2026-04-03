import { and, asc, desc, eq, ilike, max, or, sql } from 'drizzle-orm'
import type { Database } from '@/lib/db/index'
import type { LyricsJson } from '@/lib/db/schema'
import * as t from '@/lib/db/schema'
import type { Collection, Comment, Lyrics, LyricsLine, LyricsVersion, Song, User } from '@/lib/types/models'
import { recentlyAddedFromSongs, trendingFromSongs } from '@/lib/data/catalog'

function rowToSong(r: typeof t.songs.$inferSelect): Song {
  return {
    id: r.id,
    title: r.title,
    artist: r.artist,
    year: r.year,
    genre: r.genre,
    coverImage: r.coverImage ?? undefined,
    hasTranslation: r.hasTranslation,
    contributionsCount: r.contributionsCount,
  }
}

function rowToComment(r: typeof t.comments.$inferSelect): Comment {
  return {
    id: r.id,
    userId: r.userId,
    username: r.username,
    avatar: r.avatar,
    text: r.text,
    createdAt: r.createdAt,
    likes: r.likes,
  }
}

export async function dbListSongsOrdered(db: Database): Promise<Song[]> {
  const rows = await db.select().from(t.songs).orderBy(asc(t.songs.listPosition))
  return rows.map(rowToSong)
}

export async function dbGetSong(db: Database, id: string): Promise<Song | undefined> {
  const rows = await db.select().from(t.songs).where(eq(t.songs.id, id)).limit(1)
  return rows[0] ? rowToSong(rows[0]) : undefined
}

export async function dbSearchSongs(db: Database, query: string): Promise<Song[]> {
  const q = query.trim()
  if (!q) return []
  const pattern = `%${q}%`
  const qLower = q.toLowerCase()
  const rows = await db
    .select()
    .from(t.songs)
    .where(
      or(
        ilike(t.songs.title, pattern),
        ilike(t.songs.artist, pattern),
        ilike(t.songs.genre, pattern),
        sql`exists (
          select 1 from ${t.songLyrics} sl
          where sl.song_id = ${t.songs.id}
          and position(lower(${qLower}) in lower(sl.data::text)) > 0
        )`
      )
    )
    .orderBy(asc(t.songs.listPosition))
  return rows.map(rowToSong)
}

export async function dbInsertSong(db: Database, song: Song, listPosition?: number): Promise<Song> {
  let position = listPosition
  if (position === undefined) {
    const [row] = await db.select({ m: max(t.songs.listPosition) }).from(t.songs)
    position = (row?.m ?? -1) + 1
  }
  await db.insert(t.songs).values({
    id: song.id,
    title: song.title,
    artist: song.artist,
    year: song.year,
    genre: song.genre,
    coverImage: song.coverImage ?? null,
    hasTranslation: song.hasTranslation,
    contributionsCount: song.contributionsCount,
    listPosition: position,
  })
  return song
}

export async function dbListCollections(db: Database): Promise<Collection[]> {
  const cols = await db.select().from(t.collections).orderBy(asc(t.collections.createdAt))
  const links = await db.select().from(t.collectionSongs)
  const songIdsByCol = new Map<string, string[]>()
  for (const l of links) {
    const list = songIdsByCol.get(l.collectionId) ?? []
    list.push(l.songId)
    songIdsByCol.set(l.collectionId, list)
  }
  return cols.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description ?? undefined,
    coverImage: c.coverImage ?? undefined,
    songIds: songIdsByCol.get(c.id) ?? [],
    createdAt: c.createdAt,
    isPublic: c.isPublic,
    ownerUserId: c.ownerUserId ?? null,
  }))
}

export async function dbGetCollection(db: Database, id: string): Promise<Collection | undefined> {
  const cols = await db.select().from(t.collections).where(eq(t.collections.id, id)).limit(1)
  const c = cols[0]
  if (!c) return undefined
  const links = await db
    .select()
    .from(t.collectionSongs)
    .where(eq(t.collectionSongs.collectionId, id))
  return {
    id: c.id,
    name: c.name,
    description: c.description ?? undefined,
    coverImage: c.coverImage ?? undefined,
    songIds: links.map((l) => l.songId),
    createdAt: c.createdAt,
    isPublic: c.isPublic,
    ownerUserId: c.ownerUserId ?? null,
  }
}

export async function dbInsertCollection(db: Database, collection: Collection): Promise<void> {
  await db.insert(t.collections).values({
    id: collection.id,
    name: collection.name,
    description: collection.description ?? null,
    coverImage: collection.coverImage ?? null,
    createdAt: collection.createdAt,
    isPublic: collection.isPublic,
    ownerUserId: collection.ownerUserId ?? null,
  })
  if (collection.songIds.length > 0) {
    await db.insert(t.collectionSongs).values(
      collection.songIds.map((songId) => ({
        collectionId: collection.id,
        songId,
      }))
    )
  }
}

export async function dbGetLyrics(db: Database, songId: string): Promise<Lyrics | null> {
  const rows = await db.select().from(t.songLyrics).where(eq(t.songLyrics.songId, songId)).limit(1)
  if (!rows[0]) return null
  return rows[0].data as unknown as Lyrics
}

export async function dbGetAllLyrics(db: Database): Promise<Record<string, Lyrics>> {
  const rows = await db.select().from(t.songLyrics)
  const out: Record<string, Lyrics> = {}
  for (const r of rows) {
    out[r.songId] = r.data as unknown as Lyrics
  }
  return out
}

export async function dbGetCommentsForSong(db: Database, songId: string): Promise<Comment[]> {
  const rows = await db
    .select()
    .from(t.comments)
    .where(eq(t.comments.songId, songId))
    .orderBy(desc(t.comments.createdAt))
  return rows.map(rowToComment)
}

export async function dbGetAllComments(
  db: Database,
  viewerUserId: string | null
): Promise<Record<string, Comment[]>> {
  const rows = await db
    .select()
    .from(t.comments)
    .orderBy(asc(t.comments.songId), desc(t.comments.createdAt))
  let likedIds = new Set<string>()
  if (viewerUserId) {
    const lk = await db
      .select({ commentId: t.commentLikes.commentId })
      .from(t.commentLikes)
      .where(eq(t.commentLikes.userId, viewerUserId))
    likedIds = new Set(lk.map((x) => x.commentId))
  }
  const out: Record<string, Comment[]> = {}
  for (const r of rows) {
    const list = out[r.songId] ?? []
    list.push({
      ...rowToComment(r),
      likedByMe: viewerUserId ? likedIds.has(r.id) : false,
    })
    out[r.songId] = list
  }
  return out
}

export async function dbInsertComment(db: Database, songId: string, comment: Comment): Promise<void> {
  await db.insert(t.comments).values({
    id: comment.id,
    songId,
    userId: comment.userId,
    username: comment.username,
    avatar: comment.avatar,
    text: comment.text,
    createdAt: comment.createdAt,
    likes: comment.likes,
  })
}

function rowToUser(r: typeof t.users.$inferSelect): User {
  const role =
    r.role === 'admin' || r.role === 'curator' || r.role === 'contributor'
      ? r.role
      : 'user'
  return {
    id: r.id,
    username: r.username,
    email: r.email,
    avatar: r.avatar,
    contributions: r.contributions,
    badges: r.badges ?? [],
    joinedAt: r.joinedAt,
    role,
  }
}

export async function dbGetUserById(db: Database, id: string): Promise<User | null> {
  const rows = await db.select().from(t.users).where(eq(t.users.id, id)).limit(1)
  return rows[0] ? rowToUser(rows[0]) : null
}

export async function dbGetDemoUser(db: Database): Promise<User | null> {
  const rows = await db.select().from(t.users).where(eq(t.users.id, '1')).limit(1)
  return rows[0] ? rowToUser(rows[0]) : null
}

export async function dbInsertContribution(
  db: Database,
  id: string,
  userId: string | null,
  payload: Record<string, unknown>,
  createdAt: string
): Promise<void> {
  await db.insert(t.contributionSubmissions).values({
    id,
    userId,
    payload,
    createdAt,
    status: 'pending',
    reviewedByUserId: null,
    reviewedAt: null,
  })
}

export type PendingContributionRow = {
  id: string
  userId: string | null
  payload: Record<string, unknown>
  createdAt: string
}

export async function dbListPendingContributions(
  db: Database
): Promise<PendingContributionRow[]> {
  const rows = await db
    .select()
    .from(t.contributionSubmissions)
    .where(eq(t.contributionSubmissions.status, 'pending'))
    .orderBy(desc(t.contributionSubmissions.createdAt))
  return rows.map((r) => ({
    id: r.id,
    userId: r.userId,
    payload: r.payload,
    createdAt: r.createdAt,
  }))
}

export async function dbUpdateSubmissionStatus(
  db: Database,
  id: string,
  status: 'approved' | 'rejected',
  reviewedByUserId: string
): Promise<boolean> {
  const reviewedAt = new Date().toISOString()
  const updated = await db
    .update(t.contributionSubmissions)
    .set({
      status,
      reviewedByUserId,
      reviewedAt,
    })
    .where(eq(t.contributionSubmissions.id, id))
    .returning({ id: t.contributionSubmissions.id })
  return updated.length > 0
}

export async function dbTrendingAndRecent(db: Database): Promise<{
  songs: Song[]
  trending: Song[]
  recentlyAdded: Song[]
}> {
  const songs = await dbListSongsOrdered(db)
  return {
    songs,
    trending: trendingFromSongs(songs),
    recentlyAdded: recentlyAddedFromSongs(songs),
  }
}

function parseLyricLinesFromPayload(payload: Record<string, unknown>): LyricsLine[] | null {
  const linesRaw = payload.lines
  if (!Array.isArray(linesRaw) || linesRaw.length === 0) return null
  const lines: LyricsLine[] = []
  for (const item of linesRaw) {
    if (!item || typeof item !== 'object') continue
    const o = item as Record<string, unknown>
    const text = typeof o.text === 'string' ? o.text.trim() : ''
    if (!text) continue
    const id = typeof o.id === 'string' && o.id ? o.id : `L${lines.length + 1}`
    const translation =
      typeof o.translation === 'string' && o.translation.trim() ? o.translation.trim() : undefined
    lines.push({ id, text, translation })
  }
  return lines.length > 0 ? lines : null
}

async function nextListPosition(db: Database): Promise<number> {
  const [row] = await db.select({ m: max(t.songs.listPosition) }).from(t.songs)
  return (row?.m ?? -1) + 1
}

/**
 * Approve or reject a lyric submission. On approve, merges lines into `song_lyrics`
 * (new version, set as current) and creates the song row when `songId` was null.
 */
export async function dbReviewLyricSubmission(
  db: Database,
  submissionId: string,
  decision: 'approved' | 'rejected',
  reviewerUserId: string
): Promise<{ ok: true; songId?: string } | { ok: false; error: string }> {
  const rows = await db
    .select()
    .from(t.contributionSubmissions)
    .where(eq(t.contributionSubmissions.id, submissionId))
    .limit(1)
  const row = rows[0]
  if (!row) return { ok: false, error: 'Submission not found' }
  if (row.status !== 'pending') return { ok: false, error: 'Already processed' }

  const reviewedAt = new Date().toISOString()

  if (decision === 'rejected') {
    await db
      .update(t.contributionSubmissions)
      .set({
        status: 'rejected',
        reviewedByUserId: reviewerUserId,
        reviewedAt,
      })
      .where(eq(t.contributionSubmissions.id, submissionId))
    return { ok: true }
  }

  const payload = row.payload
  const lines = parseLyricLinesFromPayload(payload)
  if (!lines) {
    return { ok: false, error: 'Invalid submission: add at least one lyric line with text' }
  }

  let contributor = 'Community'
  let contributorAvatar = '/avatars/default.png'
  if (row.userId) {
    const u = await dbGetUserById(db, row.userId)
    if (u) {
      contributor = u.username
      contributorAvatar = u.avatar
    }
  }

  const versionId = `v-${submissionId.replace(/[^a-zA-Z0-9]/g, '') || crypto.randomUUID().slice(0, 12)}`
  const createdAt =
    row.createdAt.length >= 10 ? row.createdAt.slice(0, 10) : row.createdAt.split('T')[0] ?? row.createdAt
  const newVersion: LyricsVersion = {
    id: versionId,
    contributor,
    contributorAvatar,
    createdAt,
    lines,
    votes: 0,
  }
  const hasTranslation = lines.some((l) => Boolean(l.translation))

  const rawSongId = payload.songId
  let songId: string | null =
    typeof rawSongId === 'string' && rawSongId.trim() ? rawSongId.trim() : null

  if (!songId) {
    const title = typeof payload.songTitle === 'string' ? payload.songTitle.trim() : ''
    const artist = typeof payload.artist === 'string' ? payload.artist.trim() : ''
    const genre = typeof payload.genre === 'string' && payload.genre.trim() ? payload.genre.trim() : 'Unknown'
    let year: number
    if (typeof payload.year === 'number' && Number.isFinite(payload.year)) {
      year = payload.year
    } else {
      const y = parseInt(String(payload.year ?? ''), 10)
      year = Number.isFinite(y) ? y : new Date().getFullYear()
    }
    if (!title || !artist) {
      return { ok: false, error: 'New songs require title and artist in the submission' }
    }

    songId = `song_${crypto.randomUUID()}`
    const listPosition = await nextListPosition(db)
    await db.insert(t.songs).values({
      id: songId,
      title,
      artist,
      year,
      genre,
      coverImage: null,
      hasTranslation,
      contributionsCount: 1,
      listPosition,
    })

    const lyrics: Lyrics = {
      songId,
      originalLanguage: 'Original',
      translatedLanguage: hasTranslation ? 'English' : undefined,
      versions: [newVersion],
      currentVersion: versionId,
    }

    await db.insert(t.songLyrics).values({
      songId,
      data: lyrics as unknown as LyricsJson,
    })
  } else {
    const existingSong = await dbGetSong(db, songId)
    if (!existingSong) {
      return { ok: false, error: 'Song no longer exists; reject this submission or fix the id' }
    }

    const title =
      typeof payload.songTitle === 'string' && payload.songTitle.trim()
        ? payload.songTitle.trim()
        : existingSong.title
    const artist =
      typeof payload.artist === 'string' && payload.artist.trim()
        ? payload.artist.trim()
        : existingSong.artist
    const genre =
      typeof payload.genre === 'string' && payload.genre.trim()
        ? payload.genre.trim()
        : existingSong.genre
    let year = existingSong.year
    if (typeof payload.year === 'number' && Number.isFinite(payload.year)) {
      year = payload.year
    } else if (payload.year != null) {
      const y = parseInt(String(payload.year), 10)
      if (Number.isFinite(y)) year = y
    }

    await db
      .update(t.songs)
      .set({
        title,
        artist,
        genre,
        year,
        hasTranslation: existingSong.hasTranslation || hasTranslation,
        contributionsCount: sql`${t.songs.contributionsCount} + 1`,
      })
      .where(eq(t.songs.id, songId))

    const existingLyrics = await dbGetLyrics(db, songId)
    let merged: Lyrics
    if (!existingLyrics) {
      merged = {
        songId,
        originalLanguage: 'Original',
        translatedLanguage: hasTranslation ? 'English' : undefined,
        versions: [newVersion],
        currentVersion: versionId,
      }
    } else {
      const anyOldTranslation = existingLyrics.versions.some((v) =>
        v.lines.some((l) => Boolean(l.translation))
      )
      merged = {
        ...existingLyrics,
        translatedLanguage:
          hasTranslation || anyOldTranslation
            ? (existingLyrics.translatedLanguage ?? 'English')
            : existingLyrics.translatedLanguage,
        versions: [...existingLyrics.versions, newVersion],
        currentVersion: versionId,
      }
    }

    await db
      .insert(t.songLyrics)
      .values({
        songId,
        data: merged as unknown as LyricsJson,
      })
      .onConflictDoUpdate({
        target: t.songLyrics.songId,
        set: {
          data: merged as unknown as LyricsJson,
        },
      })
  }

  if (row.userId) {
    await db
      .update(t.users)
      .set({ contributions: sql`${t.users.contributions} + 1` })
      .where(eq(t.users.id, row.userId))
  }

  await db
    .update(t.contributionSubmissions)
    .set({
      status: 'approved',
      reviewedByUserId: reviewerUserId,
      reviewedAt,
    })
    .where(eq(t.contributionSubmissions.id, submissionId))

  return { ok: true, songId: songId! }
}

export async function dbListFavoriteSongIds(db: Database, userId: string): Promise<string[]> {
  const rows = await db
    .select({ songId: t.userFavorites.songId })
    .from(t.userFavorites)
    .where(eq(t.userFavorites.userId, userId))
  return rows.map((r) => r.songId)
}

export async function dbAddUserFavorite(db: Database, userId: string, songId: string): Promise<boolean> {
  const song = await dbGetSong(db, songId)
  if (!song) return false
  await db.insert(t.userFavorites).values({ userId, songId }).onConflictDoNothing()
  return true
}

export async function dbRemoveUserFavorite(db: Database, userId: string, songId: string): Promise<void> {
  await db
    .delete(t.userFavorites)
    .where(and(eq(t.userFavorites.userId, userId), eq(t.userFavorites.songId, songId)))
}

export async function dbInsertCollectionSong(
  db: Database,
  collectionId: string,
  songId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const song = await dbGetSong(db, songId)
  if (!song) return { ok: false, error: 'Song not found' }
  const col = await dbGetCollection(db, collectionId)
  if (!col) return { ok: false, error: 'Collection not found' }
  await db.insert(t.collectionSongs).values({ collectionId, songId }).onConflictDoNothing()
  return { ok: true }
}

export async function dbToggleCommentLike(
  db: Database,
  songId: string,
  commentId: string,
  userId: string
): Promise<{ likes: number; likedByMe: boolean } | null> {
  const [c] = await db.select().from(t.comments).where(eq(t.comments.id, commentId)).limit(1)
  if (!c || c.songId !== songId) return null

  const [existing] = await db
    .select()
    .from(t.commentLikes)
    .where(and(eq(t.commentLikes.commentId, commentId), eq(t.commentLikes.userId, userId)))
    .limit(1)

  if (existing) {
    await db
      .delete(t.commentLikes)
      .where(and(eq(t.commentLikes.commentId, commentId), eq(t.commentLikes.userId, userId)))
    const next = Math.max(0, c.likes - 1)
    await db.update(t.comments).set({ likes: next }).where(eq(t.comments.id, commentId))
    return { likes: next, likedByMe: false }
  }

  await db.insert(t.commentLikes).values({ commentId, userId })
  const next = c.likes + 1
  await db.update(t.comments).set({ likes: next }).where(eq(t.comments.id, commentId))
  return { likes: next, likedByMe: true }
}
