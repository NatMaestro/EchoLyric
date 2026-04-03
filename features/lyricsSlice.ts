import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SEED_COMMENTS, SEED_LYRICS } from '@/lib/data/catalog'
import type { Comment, Lyrics, LyricsLine } from '@/lib/types/models'

export type { Comment, Lyrics, LyricsLine, LyricsVersion } from '@/lib/types/models'

interface LyricsState {
  lyrics: Record<string, Lyrics>
  comments: Record<string, Comment[]>
  currentLyrics: Lyrics | null
  showTranslation: boolean
  highlightedLine: number | null
  isEditing: boolean
}

const initialState: LyricsState = {
  lyrics: SEED_LYRICS,
  comments: SEED_COMMENTS,
  currentLyrics: null,
  showTranslation: false,
  highlightedLine: null,
  isEditing: false,
}

const lyricsSlice = createSlice({
  name: 'lyrics',
  initialState,
  reducers: {
    hydrateLyricsData: (
      state,
      action: PayloadAction<{ lyrics: Record<string, Lyrics>; comments: Record<string, Comment[]> }>
    ) => {
      state.lyrics = action.payload.lyrics
      state.comments = action.payload.comments
    },
    setCurrentLyrics: (state, action: PayloadAction<string>) => {
      state.currentLyrics = state.lyrics[action.payload] || null
    },
    toggleTranslation: (state) => {
      state.showTranslation = !state.showTranslation
    },
    setHighlightedLine: (state, action: PayloadAction<number | null>) => {
      state.highlightedLine = action.payload
    },
    setEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload
    },
    addComment: (state, action: PayloadAction<{ songId: string; comment: Comment }>) => {
      const { songId, comment } = action.payload
      if (!state.comments[songId]) {
        state.comments[songId] = []
      }
      state.comments[songId].unshift({ ...comment, likedByMe: false })
    },
    patchComment: (
      state,
      action: PayloadAction<{
        songId: string
        commentId: string
        likes: number
        likedByMe: boolean
      }>
    ) => {
      const { songId, commentId, likes, likedByMe } = action.payload
      const list = state.comments[songId]
      if (!list) return
      const i = list.findIndex((c) => c.id === commentId)
      if (i === -1) return
      list[i] = { ...list[i], likes, likedByMe }
    },
    updateLyrics: (
      state,
      action: PayloadAction<{ songId: string; lines: LyricsLine[] }>
    ) => {
      const { songId, lines } = action.payload
      if (state.lyrics[songId]) {
        const currentVersionId = state.lyrics[songId].currentVersion
        const versionIndex = state.lyrics[songId].versions.findIndex(
          (v) => v.id === currentVersionId
        )
        if (versionIndex !== -1) {
          state.lyrics[songId].versions[versionIndex].lines = lines
        }
      }
    },
  },
})

export const {
  hydrateLyricsData,
  setCurrentLyrics,
  toggleTranslation,
  setHighlightedLine,
  setEditing,
  addComment,
  patchComment,
  updateLyrics,
} = lyricsSlice.actions
export default lyricsSlice.reducer
