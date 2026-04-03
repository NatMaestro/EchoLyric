import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SEED_COLLECTIONS } from '@/lib/data/catalog'
import type { Collection } from '@/lib/types/models'

export type { Collection } from '@/lib/types/models'

interface CollectionState {
  collections: Collection[]
  selectedCollection: Collection | null
  isLoading: boolean
}

const initialState: CollectionState = {
  collections: SEED_COLLECTIONS,
  selectedCollection: null,
  isLoading: false,
}

const collectionSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    hydrateCollections: (state, action: PayloadAction<Collection[]>) => {
      state.collections = action.payload
    },
    setSelectedCollection: (state, action: PayloadAction<Collection | null>) => {
      state.selectedCollection = action.payload
    },
    addCollection: (state, action: PayloadAction<Collection>) => {
      state.collections.push(action.payload)
    },
    updateCollection: (state, action: PayloadAction<Collection>) => {
      const index = state.collections.findIndex((c) => c.id === action.payload.id)
      if (index !== -1) {
        state.collections[index] = action.payload
      }
    },
    deleteCollection: (state, action: PayloadAction<string>) => {
      state.collections = state.collections.filter((c) => c.id !== action.payload)
    },
    addSongToCollection: (
      state,
      action: PayloadAction<{ collectionId: string; songId: string }>
    ) => {
      const collection = state.collections.find((c) => c.id === action.payload.collectionId)
      if (collection && !collection.songIds.includes(action.payload.songId)) {
        collection.songIds.push(action.payload.songId)
      }
    },
    removeSongFromCollection: (
      state,
      action: PayloadAction<{ collectionId: string; songId: string }>
    ) => {
      const collection = state.collections.find((c) => c.id === action.payload.collectionId)
      if (collection) {
        collection.songIds = collection.songIds.filter((id) => id !== action.payload.songId)
      }
    },
  },
})

export const {
  hydrateCollections,
  setSelectedCollection,
  addCollection,
  updateCollection,
  deleteCollection,
  addSongToCollection,
  removeSongFromCollection,
} = collectionSlice.actions
export default collectionSlice.reducer
