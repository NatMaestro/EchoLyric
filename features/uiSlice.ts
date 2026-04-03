import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MEMORY_SUGGESTIONS } from '@/lib/data/catalog'
import type { MemorySuggestion } from '@/lib/types/models'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface Modal {
  type: string | null
  data?: unknown
}

interface UIState {
  sidebarCollapsed: boolean
  theme: 'dark' | 'light'
  toasts: Toast[]
  modal: Modal
  isMemorySearchMode: boolean
  activeTab: string
  memorySuggestions: MemorySuggestion[]
}

const initialState: UIState = {
  sidebarCollapsed: false,
  theme: 'dark',
  toasts: [],
  modal: { type: null },
  isMemorySearchMode: false,
  activeTab: 'songs',
  memorySuggestions: MEMORY_SUGGESTIONS,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
    },
    setTheme: (state, action: PayloadAction<'dark' | 'light'>) => {
      state.theme = action.payload
    },
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      state.toasts.push({
        ...action.payload,
        id: Date.now().toString(),
      })
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload)
    },
    openModal: (state, action: PayloadAction<Modal>) => {
      state.modal = action.payload
    },
    closeModal: (state) => {
      state.modal = { type: null }
    },
    toggleMemorySearchMode: (state) => {
      state.isMemorySearchMode = !state.isMemorySearchMode
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload
    },
    hydrateMemorySuggestions: (state, action: PayloadAction<MemorySuggestion[]>) => {
      state.memorySuggestions = action.payload
    },
  },
})

export const { 
  toggleSidebar,
  setSidebarCollapsed,
  toggleTheme, 
  setTheme,
  addToast, 
  removeToast,
  openModal,
  closeModal,
  toggleMemorySearchMode,
  setActiveTab,
  hydrateMemorySuggestions,
} = uiSlice.actions
export default uiSlice.reducer
