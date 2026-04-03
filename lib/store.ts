import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/authSlice'
import songReducer from '@/features/songSlice'
import lyricsReducer from '@/features/lyricsSlice'
import collectionReducer from '@/features/collectionSlice'
import profileReducer from '@/features/profileSlice'
import uiReducer from '@/features/uiSlice'
import favoritesReducer from '@/features/favoritesSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    songs: songReducer,
    lyrics: lyricsReducer,
    collections: collectionReducer,
    profile: profileReducer,
    ui: uiReducer,
    favorites: favoritesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
