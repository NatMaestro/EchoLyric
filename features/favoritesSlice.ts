import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface FavoritesState {
  songIds: string[]
}

const initialState: FavoritesState = {
  songIds: [],
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    hydrateFavorites: (state, action: PayloadAction<string[]>) => {
      state.songIds = action.payload
    },
    addFavoriteId: (state, action: PayloadAction<string>) => {
      if (!state.songIds.includes(action.payload)) {
        state.songIds.push(action.payload)
      }
    },
    removeFavoriteId: (state, action: PayloadAction<string>) => {
      state.songIds = state.songIds.filter((id) => id !== action.payload)
    },
  },
})

export const { hydrateFavorites, addFavoriteId, removeFavoriteId } = favoritesSlice.actions
export default favoritesSlice.reducer
