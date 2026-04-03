import { createAsyncThunk } from '@reduxjs/toolkit'
import { setUser } from '@/features/authSlice'
import { hydrateCollections } from '@/features/collectionSlice'
import { hydrateLyricsData } from '@/features/lyricsSlice'
import { hydrateProfileActivity } from '@/features/profileSlice'
import { hydrateSongFeed } from '@/features/songSlice'
import { hydrateMemorySuggestions } from '@/features/uiSlice'
import { hydrateFavorites } from '@/features/favoritesSlice'
import type { Collection, Comment, Lyrics, MemorySuggestion, ProfileActivity, Song, User } from '@/lib/types/models'

export type InitialStatePayload = {
  songs: Song[]
  trending: Song[]
  recentlyAdded: Song[]
  collections: Collection[]
  lyrics: Record<string, Lyrics>
  comments: Record<string, Comment[]>
  user: User | null
  profileActivity: ProfileActivity[]
  memorySuggestions: MemorySuggestion[]
  favoriteSongIds: string[]
}

export const hydrateFromApi = createAsyncThunk(
  'app/hydrateFromApi',
  async (_, { dispatch }) => {
    const res = await fetch('/api/initial-state')
    if (!res.ok) {
      throw new Error(`Failed to load app data: ${res.status}`)
    }
    const payload = (await res.json()) as InitialStatePayload

    dispatch(
      hydrateSongFeed({
        songs: payload.songs,
        trending: payload.trending,
        recentlyAdded: payload.recentlyAdded,
      })
    )
    dispatch(hydrateCollections(payload.collections))
    dispatch(
      hydrateLyricsData({
        lyrics: payload.lyrics,
        comments: payload.comments,
      })
    )
    dispatch(setUser(payload.user ?? null))
    dispatch(hydrateProfileActivity(payload.profileActivity))
    dispatch(hydrateMemorySuggestions(payload.memorySuggestions))
    dispatch(hydrateFavorites(payload.favoriteSongIds ?? []))
    return payload
  }
)
