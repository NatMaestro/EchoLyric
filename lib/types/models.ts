/** Shared domain types for API + Redux (avoids circular imports with seed data). */

export interface Song {
  id: string
  title: string
  artist: string
  year: number
  genre: string
  coverImage?: string
  hasTranslation: boolean
  contributionsCount: number
}

export interface Collection {
  id: string
  name: string
  description?: string
  coverImage?: string
  songIds: string[]
  createdAt: string
  isPublic: boolean
  /** When set, only this user (or admins) should edit membership; null = community collection. */
  ownerUserId?: string | null
}

export interface LyricsLine {
  id: string
  text: string
  translation?: string
  timestamp?: number
}

export interface LyricsVersion {
  id: string
  contributor: string
  contributorAvatar: string
  createdAt: string
  lines: LyricsLine[]
  votes: number
}

export interface Lyrics {
  songId: string
  originalLanguage: string
  translatedLanguage?: string
  story?: string
  versions: LyricsVersion[]
  currentVersion: string
}

export interface Comment {
  id: string
  userId: string
  username: string
  avatar: string
  text: string
  createdAt: string
  likes: number
  /** Present when loaded for the current viewer. */
  likedByMe?: boolean
}

export interface User {
  id: string
  username: string
  email: string
  avatar: string
  contributions: number
  badges: string[]
  joinedAt: string
  role?: 'user' | 'contributor' | 'curator' | 'admin'
}

export interface MemorySuggestion {
  original: string
  match: string
  songId: string
}

export interface ProfileActivity {
  id: string
  type: 'lyrics' | 'translation' | 'correction' | 'comment'
  songTitle: string
  action: string
  date: string
}
