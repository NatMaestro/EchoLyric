import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SEED_SONGS, recentlyAddedFromSongs, trendingFromSongs } from '@/lib/data/catalog'
import type { Song } from '@/lib/types/models'

export type { Song } from '@/lib/types/models'

interface SongState {
  songs: Song[]
  trending: Song[]
  recentlyAdded: Song[]
  selectedSong: Song | null
  isLoading: boolean
  searchQuery: string
  searchResults: Song[]
}

const initialState: SongState = {
  songs: SEED_SONGS,
  trending: trendingFromSongs(SEED_SONGS),
  recentlyAdded: recentlyAddedFromSongs(SEED_SONGS),
  selectedSong: null,
  isLoading: false,
  searchQuery: '',
  searchResults: [],
}

const songSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: {
    hydrateSongFeed: (
      state,
      action: PayloadAction<{ songs: Song[]; trending: Song[]; recentlyAdded: Song[] }>
    ) => {
      state.songs = action.payload.songs
      state.trending = action.payload.trending
      state.recentlyAdded = action.payload.recentlyAdded
    },
    setSelectedSong: (state, action: PayloadAction<Song | null>) => {
      state.selectedSong = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setSearchResults: (state, action: PayloadAction<Song[]>) => {
      state.searchResults = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    addSong: (state, action: PayloadAction<Song>) => {
      state.songs.push(action.payload)
      state.recentlyAdded.unshift(action.payload)
    },
  },
})

export const {
  hydrateSongFeed,
  setSelectedSong,
  setSearchQuery,
  setSearchResults,
  setLoading,
  addSong,
} = songSlice.actions
export default songSlice.reducer
