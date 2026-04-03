import type {
  Collection,
  Comment,
  Lyrics,
  MemorySuggestion,
  ProfileActivity,
  Song,
  User,
} from '@/lib/types/models'

function lyricsTextMatches(lyrics: Lyrics | undefined, qLower: string): boolean {
  if (!lyrics) return false
  return JSON.stringify(lyrics).toLowerCase().includes(qLower)
}

export const SEED_SONGS: Song[] = [
  {
    id: '1',
    title: 'Yaanom',
    artist: 'Daddy Lumba',
    year: 1999,
    genre: 'Highlife',
    hasTranslation: true,
    contributionsCount: 12,
  },
  {
    id: '2',
    title: 'African Queen',
    artist: '2Baba',
    year: 2004,
    genre: 'Afrobeat',
    hasTranslation: false,
    contributionsCount: 8,
  },
  {
    id: '3',
    title: 'Obi Agye Me Dofo',
    artist: 'Amakye Dede',
    year: 1985,
    genre: 'Highlife',
    hasTranslation: true,
    contributionsCount: 15,
  },
  {
    id: '4',
    title: 'Medo Wo',
    artist: 'Ofori Amponsah',
    year: 2002,
    genre: 'Hiplife',
    hasTranslation: true,
    contributionsCount: 6,
  },
  {
    id: '5',
    title: 'Makoma',
    artist: 'King Promise',
    year: 2019,
    genre: 'Afrobeat',
    hasTranslation: false,
    contributionsCount: 3,
  },
  {
    id: '6',
    title: 'Obra',
    artist: 'Kojo Antwi',
    year: 1990,
    genre: 'Highlife',
    hasTranslation: true,
    contributionsCount: 20,
  },
  {
    id: '7',
    title: 'Awurade Kasa',
    artist: 'Joe Mettle',
    year: 2017,
    genre: 'Gospel',
    hasTranslation: true,
    contributionsCount: 9,
  },
  {
    id: '8',
    title: 'Linda',
    artist: 'Sarkodie ft. Kizz Daniel',
    year: 2020,
    genre: 'Hiplife',
    hasTranslation: false,
    contributionsCount: 5,
  },
]

export const SEED_COLLECTIONS: Collection[] = [
  {
    id: 'col1',
    name: 'Classic Highlife',
    description: 'The best of Ghanaian Highlife from the 80s and 90s',
    songIds: ['1', '3', '6'],
    createdAt: '2024-08-15',
    isPublic: true,
  },
  {
    id: 'col2',
    name: 'Gospel Favorites',
    description: 'Uplifting gospel songs for the soul',
    songIds: ['7'],
    createdAt: '2024-09-20',
    isPublic: false,
  },
  {
    id: 'col3',
    name: 'Modern Afrobeats',
    description: 'Contemporary African music hits',
    songIds: ['2', '5', '8'],
    createdAt: '2024-10-05',
    isPublic: true,
  },
  {
    id: 'col4',
    name: 'Hiplife Anthems',
    description: 'The evolution of Ghanaian music',
    songIds: ['4', '8'],
    createdAt: '2024-10-28',
    isPublic: true,
  },
]

export const SEED_LYRICS: Record<string, Lyrics> = {
  '1': {
    songId: '1',
    originalLanguage: 'Twi',
    translatedLanguage: 'English',
    story:
      'Yaanom is a classic Highlife song by Daddy Lumba that speaks about the importance of family and unity. Released in 1999, it became an anthem for family gatherings across Ghana.',
    versions: [
      {
        id: 'v1',
        contributor: 'lyrickeeper',
        contributorAvatar: '/avatars/default.png',
        createdAt: '2024-06-15',
        votes: 45,
        lines: [
          { id: '1', text: 'Yaanom, yaanom', translation: 'Family, family' },
          { id: '2', text: 'Obiara hw3 ne yaanom', translation: 'Everyone looks after their family' },
          { id: '3', text: 'Wo yaanom ne wo', translation: 'Your family is you' },
          { id: '4', text: 'Na wo ne wo yaanom', translation: 'And you are your family' },
          { id: '5', text: 'Y3n tena ase y3n nyinaa', translation: 'Let us all live together' },
          { id: '6', text: 'Y3n hw3 y3n ho', translation: 'Let us take care of each other' },
          { id: '7', text: 'Odo ne aseda', translation: 'Love and gratitude' },
          { id: '8', text: 'Na 3y3 ade kese', translation: 'Are precious things' },
        ],
      },
    ],
    currentVersion: 'v1',
  },
  '3': {
    songId: '3',
    originalLanguage: 'Twi',
    translatedLanguage: 'English',
    story:
      'A timeless classic from Amakye Dede, this song tells the story of lost love and the pain of watching someone you love be taken away. It remains one of the most beloved Highlife songs in Ghana.',
    versions: [
      {
        id: 'v1',
        contributor: 'musiclover',
        contributorAvatar: '/avatars/default.png',
        createdAt: '2024-05-20',
        votes: 67,
        lines: [
          { id: '1', text: 'Obi agye me dofo', translation: 'Someone has taken my love' },
          { id: '2', text: "M'ani nnye me ho", translation: 'I am not happy' },
          { id: '3', text: 'Me koma so me ya', translation: 'My heart is in pain' },
          { id: '4', text: 'Ewiase yi mu', translation: 'In this world' },
          { id: '5', text: 'Odo ye owu', translation: 'Love is like death' },
          { id: '6', text: 'Na wo nnim bere a', translation: "You don't know when" },
          { id: '7', text: 'Eba wo so', translation: 'It will come to you' },
        ],
      },
    ],
    currentVersion: 'v1',
  },
}

export const SEED_COMMENTS: Record<string, Comment[]> = {
  '1': [
    {
      id: 'c1',
      userId: 'u2',
      username: 'afrobeatlover',
      avatar: '/avatars/default.png',
      text: 'This song brings back so many memories of family gatherings!',
      createdAt: '2024-11-10',
      likes: 23,
    },
    {
      id: 'c2',
      userId: 'u3',
      username: 'highlifefan',
      avatar: '/avatars/default.png',
      text: 'Daddy Lumba is a legend. This translation is perfect!',
      createdAt: '2024-11-08',
      likes: 15,
    },
  ],
}

export const DEMO_USER: User = {
  id: '1',
  username: 'lyrickeeper',
  email: 'demo@echolyric.com',
  avatar: '/avatars/default.png',
  contributions: 47,
  badges: ['Early Adopter', 'Top Contributor', 'Archivist'],
  joinedAt: '2024-01-15',
}

export const MEMORY_SUGGESTIONS: MemorySuggestion[] = [
  { original: 'that family song', match: 'Yaanom by Daddy Lumba', songId: '1' },
  { original: 'love song 90s', match: 'Obi Agye Me Dofo by Amakye Dede', songId: '3' },
  { original: 'church song praise', match: 'Awurade Kasa by Joe Mettle', songId: '7' },
]

export const PROFILE_ACTIVITY: ProfileActivity[] = [
  { id: '1', type: 'lyrics', songTitle: 'Yaanom', action: 'Added lyrics', date: '2024-11-10' },
  { id: '2', type: 'translation', songTitle: 'Obi Agye Me Dofo', action: 'Added translation', date: '2024-11-08' },
  { id: '3', type: 'correction', songTitle: 'Obra', action: 'Suggested correction', date: '2024-11-05' },
  { id: '4', type: 'comment', songTitle: 'African Queen', action: 'Commented', date: '2024-11-01' },
]

export function trendingFromSongs(songs: Song[]): Song[] {
  return songs.slice(0, 4)
}

export function recentlyAddedFromSongs(songs: Song[]): Song[] {
  return songs.slice(4)
}

export function filterSongsByQuery(songs: Song[], query: string): Song[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return songs.filter(
    (song) =>
      song.title.toLowerCase().includes(q) ||
      song.artist.toLowerCase().includes(q) ||
      song.genre.toLowerCase().includes(q)
  )
}

/** Title, artist, genre, or JSON lyrics body (memory / fallback search). */
export function searchSongsWithLyrics(
  songs: Song[],
  lyricsBySongId: Record<string, Lyrics>,
  query: string
): Song[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return songs.filter((song) => {
    if (
      song.title.toLowerCase().includes(q) ||
      song.artist.toLowerCase().includes(q) ||
      song.genre.toLowerCase().includes(q)
    ) {
      return true
    }
    return lyricsTextMatches(lyricsBySongId[song.id], q)
  })
}

export function filterSuggestions(query: string): MemorySuggestion[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (words.length === 0) return []
  return MEMORY_SUGGESTIONS.filter((s) =>
    words.some((word) => s.original.toLowerCase().includes(word))
  )
}
