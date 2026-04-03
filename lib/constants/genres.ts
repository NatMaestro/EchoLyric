/**
 * Canonical genre taxonomy for Echolyric (contribute form, search links, validation).
 * Keep in sync with any DB checks or analytics you add later.
 */
export const GENRES = [
  'African Traditional Songs',
  'Afro-Latin',
  'Afro-rap',
  'Afrobeat',
  'Afrobeats',
  'Afropop',
  'Alternative Rock',
  'Americana',
  'Amapiano',
  'Azonto',
  'Bluegrass',
  'Blues',
  'Bongo Flava',
  'Boom Bap',
  'Choir Music',
  'Conscious Rap',
  'Contemporary Gospel',
  'Country',
  'Cultural Songs',
  'Dance Pop',
  'Dancehall',
  'Drill',
  'EDM',
  'Folk Songs',
  'Fuji',
  'Funk',
  'Gospel',
  'Highlife',
  'Hiplife',
  'Hip Hop',
  'House',
  'Hymns',
  'Indie Pop',
  'Indie Rock',
  'Jazz',
  'Juju',
  'Kwaito',
  'Latin Pop',
  'Makossa',
  'Metal',
  'Movie Songs',
  'Musical Theatre Songs',
  'Neo Soul',
  'Oral Heritage Songs',
  'Palmwine Music',
  'Pop',
  'Praise & Worship',
  'Punk Rock',
  'Quiet Storm',
  'R&B',
  'Reggae',
  'Reggaeton',
  'Rock',
  'Salsa',
  'Ska',
  'Soul',
  'Soukous',
  'Spirituals',
  'Swing',
  'Synth Pop',
  'Traditional Gospel',
  'Trap',
  'Tribal Songs',
  'TV Theme Songs',
  'Worship',
].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))

export const DEFAULT_GENRE = 'Highlife'

export function isKnownGenre(value: string): boolean {
  return GENRES.includes(value)
}

/** If the song has a legacy/custom genre, keep it selectable in the combobox. */
export function genresForPicker(currentValue: string): readonly string[] {
  if (!currentValue || isKnownGenre(currentValue)) return GENRES
  return [currentValue, ...GENRES] as const
}

/** Curated tiles for the home page (not the full taxonomy). */
export const FEATURED_GENRE_CATEGORIES = [
  {
    name: 'Highlife',
    description: 'Classic West African guitar bands',
    color: 'from-emerald-500/30 to-green-600/20',
    iconKey: 'disc' as const,
  },
  {
    name: 'Hiplife',
    description: 'Hip hop meets highlife',
    color: 'from-blue-500/30 to-indigo-600/20',
    iconKey: 'mic' as const,
  },
  {
    name: 'Afrobeats',
    description: 'Contemporary African pop',
    color: 'from-purple-500/30 to-violet-600/20',
    iconKey: 'radio' as const,
  },
  {
    name: 'Gospel',
    description: 'Faith, choir, and worship',
    color: 'from-amber-500/30 to-yellow-600/20',
    iconKey: 'music' as const,
  },
  {
    name: 'Amapiano',
    description: 'South African piano-led grooves',
    color: 'from-cyan-500/30 to-teal-600/20',
    iconKey: 'radio' as const,
  },
  {
    name: 'Dancehall',
    description: 'Caribbean club energy',
    color: 'from-rose-500/30 to-orange-600/20',
    iconKey: 'mic' as const,
  },
  {
    name: 'Hip Hop',
    description: 'Rap, trap, drill, and more',
    color: 'from-zinc-500/30 to-slate-600/20',
    iconKey: 'mic' as const,
  },
  {
    name: 'R&B',
    description: 'Soul, neo soul, and quiet storm',
    color: 'from-pink-500/30 to-fuchsia-600/20',
    iconKey: 'music' as const,
  },
  {
    name: 'Afropop',
    description: 'Pop with African roots',
    color: 'from-violet-500/30 to-purple-600/20',
    iconKey: 'disc' as const,
  },
  {
    name: 'African Traditional Songs',
    description: 'Folk, tribal, and oral heritage',
    color: 'from-lime-500/30 to-green-700/20',
    iconKey: 'music' as const,
  },
  {
    name: 'Jazz',
    description: 'Swing, blues, and improvisation',
    color: 'from-sky-500/30 to-blue-700/20',
    iconKey: 'disc' as const,
  },
  {
    name: 'Movie Songs',
    description: 'Soundtracks and themes',
    color: 'from-indigo-500/30 to-blue-600/20',
    iconKey: 'radio' as const,
  },
] as const
