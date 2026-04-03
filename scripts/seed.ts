/**
 * Loads catalog data into Neon. Requires DATABASE_URL and applied schema (npm run db:push).
 * Run: npx tsx scripts/seed.ts
 */
import 'dotenv/config'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import {
  DEMO_USER,
  SEED_COLLECTIONS,
  SEED_COMMENTS,
  SEED_LYRICS,
  SEED_SONGS,
} from '../lib/data/catalog'
import * as t from '../lib/db/schema'

async function main() {
  const url = process.env.DATABASE_URL
  if (!url?.trim()) {
    throw new Error('Set DATABASE_URL to your Neon connection string')
  }

  const db = drizzle(neon(url), { schema: t })

  await db.delete(t.commentLikes)
  await db.delete(t.userFavorites)
  await db.delete(t.comments)
  await db.delete(t.collectionSongs)
  await db.delete(t.songLyrics)
  await db.delete(t.collections)
  await db.delete(t.songs)
  await db.delete(t.users)
  await db.delete(t.contributionSubmissions)

  await db.insert(t.users).values({
    id: DEMO_USER.id,
    username: DEMO_USER.username,
    email: DEMO_USER.email.toLowerCase(),
    avatar: DEMO_USER.avatar,
    contributions: DEMO_USER.contributions,
    badges: DEMO_USER.badges,
    joinedAt: DEMO_USER.joinedAt,
    githubId: null,
    googleId: null,
    passwordHash: null,
    role: 'admin',
  })

  await db.insert(t.songs).values(
    SEED_SONGS.map((s, i) => ({
      id: s.id,
      title: s.title,
      artist: s.artist,
      year: s.year,
      genre: s.genre,
      coverImage: s.coverImage ?? null,
      hasTranslation: s.hasTranslation,
      contributionsCount: s.contributionsCount,
      listPosition: i,
    }))
  )

  await db.insert(t.songLyrics).values(
    Object.entries(SEED_LYRICS).map(([songId, lyrics]) => ({
      songId,
      data: lyrics as unknown as Record<string, unknown>,
    }))
  )

  await db.insert(t.collections).values(
    SEED_COLLECTIONS.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description ?? null,
      coverImage: c.coverImage ?? null,
      createdAt: c.createdAt,
      isPublic: c.isPublic,
      ownerUserId: null,
    }))
  )

  const junction: { collectionId: string; songId: string }[] = []
  for (const c of SEED_COLLECTIONS) {
    for (const songId of c.songIds) {
      junction.push({ collectionId: c.id, songId })
    }
  }
  if (junction.length > 0) {
    await db.insert(t.collectionSongs).values(junction)
  }

  const flatComments: (typeof t.comments.$inferInsert)[] = []
  for (const [songId, list] of Object.entries(SEED_COMMENTS)) {
    for (const c of list) {
      flatComments.push({
        id: c.id,
        songId,
        userId: c.userId,
        username: c.username,
        avatar: c.avatar,
        text: c.text,
        createdAt: c.createdAt,
        likes: c.likes,
      })
    }
  }
  if (flatComments.length > 0) {
    await db.insert(t.comments).values(flatComments)
  }

  console.log('Seed complete: songs, lyrics, collections, comments, demo user.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
