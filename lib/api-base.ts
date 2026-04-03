/** Base path for Next.js Route Handlers (Netlify serverless on deploy). */
export const API_BASE = '/api'

/** Documented routes used by the Echolyric UI and integrations. */
export const apiRoutes = {
  initialState: `${API_BASE}/initial-state`,
  health: `${API_BASE}/health`,
  songs: `${API_BASE}/songs`,
  songsTrending: `${API_BASE}/songs/trending`,
  songsRecent: `${API_BASE}/songs/recent`,
  songsSearch: (q: string) => `${API_BASE}/songs/search?q=${encodeURIComponent(q)}`,
  song: (id: string) => `${API_BASE}/songs/${id}`,
  songLyrics: (id: string) => `${API_BASE}/songs/${id}/lyrics`,
  songComments: (id: string) => `${API_BASE}/songs/${id}/comments`,
  collections: `${API_BASE}/collections`,
  collection: (id: string) => `${API_BASE}/collections/${id}`,
  authMe: `${API_BASE}/auth/me`,
  profileActivity: `${API_BASE}/profile/activity`,
  searchSuggestions: (q: string) =>
    `${API_BASE}/search/suggestions?q=${encodeURIComponent(q)}`,
  contributions: `${API_BASE}/contributions`,
} as const
