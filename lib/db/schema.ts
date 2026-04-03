import {
  boolean,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
} from 'drizzle-orm/pg-core'

/** Lyrics JSON matches `Lyrics` in lib/types/models (validated at app boundary). */
export type LyricsJson = Record<string, unknown>

export const songs = pgTable('songs', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  artist: text('artist').notNull(),
  year: integer('year').notNull(),
  genre: text('genre').notNull(),
  coverImage: text('cover_image'),
  hasTranslation: boolean('has_translation').notNull().default(false),
  contributionsCount: integer('contributions_count').notNull().default(0),
  /** Lower = earlier in browse order; first 4 = “trending”, rest = “recently added”. */
  listPosition: integer('list_position').notNull().default(0),
})

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull(),
  email: text('email').notNull().unique(),
  avatar: text('avatar').notNull(),
  contributions: integer('contributions').notNull().default(0),
  badges: jsonb('badges').notNull().$type<string[]>(),
  joinedAt: text('joined_at').notNull(),
  githubId: text('github_id').unique(),
  googleId: text('google_id').unique(),
  passwordHash: text('password_hash'),
  role: text('role').notNull().default('user'),
})

export const collections = pgTable('collections', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  coverImage: text('cover_image'),
  createdAt: text('created_at').notNull(),
  isPublic: boolean('is_public').notNull().default(true),
  ownerUserId: text('owner_user_id').references(() => users.id, { onDelete: 'set null' }),
})

export const collectionSongs = pgTable(
  'collection_songs',
  {
    collectionId: text('collection_id')
      .notNull()
      .references(() => collections.id, { onDelete: 'cascade' }),
    songId: text('song_id')
      .notNull()
      .references(() => songs.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.collectionId, t.songId] }),
  })
)

export const songLyrics = pgTable('song_lyrics', {
  songId: text('song_id')
    .primaryKey()
    .references(() => songs.id, { onDelete: 'cascade' }),
  data: jsonb('data').notNull().$type<LyricsJson>(),
})

export const comments = pgTable('comments', {
  id: text('id').primaryKey(),
  songId: text('song_id')
    .notNull()
    .references(() => songs.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull(),
  username: text('username').notNull(),
  avatar: text('avatar').notNull(),
  text: text('text').notNull(),
  createdAt: text('created_at').notNull(),
  likes: integer('likes').notNull().default(0),
})

export const userFavorites = pgTable(
  'user_favorites',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    songId: text('song_id')
      .notNull()
      .references(() => songs.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.songId] }),
  })
)

export const commentLikes = pgTable(
  'comment_likes',
  {
    commentId: text('comment_id')
      .notNull()
      .references(() => comments.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.commentId, t.userId] }),
  })
)

export const contributionSubmissions = pgTable('contribution_submissions', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  payload: jsonb('payload').notNull().$type<Record<string, unknown>>(),
  createdAt: text('created_at').notNull(),
  status: text('status').notNull().default('pending'),
  reviewedByUserId: text('reviewed_by_user_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  reviewedAt: text('reviewed_at'),
})
