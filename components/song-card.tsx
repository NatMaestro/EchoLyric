'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Music, Languages, Users } from 'lucide-react'
import type { Song } from '@/features/songSlice'
import { cn } from '@/lib/utils'

interface SongCardProps {
  song: Song
  index?: number
}

const PALETTE = [
  'from-violet-500/20 to-violet-600/10 border-violet-500/20',
  'from-cyan-500/20 to-cyan-600/10 border-cyan-500/20',
  'from-rose-500/20 to-rose-600/10 border-rose-500/20',
  'from-lime-500/20 to-lime-600/10 border-lime-500/20',
  'from-orange-500/20 to-orange-600/10 border-orange-500/20',
  'from-sky-500/20 to-sky-600/10 border-sky-500/20',
] as const

function accentForGenre(genre: string): string {
  const g = genre.toLowerCase()
  if (g.includes('gospel') || g.includes('worship') || g.includes('hymn') || g.includes('spiritual') || g.includes('choir') || g.includes('praise')) {
    return 'from-amber-500/20 to-amber-600/10 border-amber-500/20'
  }
  if (g.includes('highlife') || g.includes('hiplife') || g.includes('azonto') || g.includes('palmwine')) {
    return 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20'
  }
  if (g.includes('afrobeat') || g.includes('afrobeats') || g.includes('amapiano') || g.includes('bongo') || g.includes('kwaito')) {
    return 'from-purple-500/20 to-purple-600/10 border-purple-500/20'
  }
  if (g.includes('hip hop') || g.includes('hiphop') || g.includes('trap') || g.includes('drill') || g.includes('rap')) {
    return 'from-blue-500/20 to-blue-600/10 border-blue-500/20'
  }
  if (g.includes('jazz') || g.includes('blues') || g.includes('swing')) {
    return 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/20'
  }
  if (g.includes('reggae') || g.includes('dancehall') || g.includes('ska')) {
    return 'from-green-500/20 to-green-600/10 border-green-500/20'
  }
  if (g.includes('traditional') || g.includes('folk') || g.includes('tribal') || g.includes('cultural') || g.includes('oral')) {
    return 'from-teal-500/20 to-teal-600/10 border-teal-500/20'
  }
  if (g.includes('r&b') || g.includes('rnb') || g.includes('soul') || g.includes('neo soul') || g.includes('funk')) {
    return 'from-pink-500/20 to-pink-600/10 border-pink-500/20'
  }
  if (g.includes('rock') || g.includes('metal') || g.includes('punk')) {
    return 'from-zinc-500/20 to-zinc-600/10 border-zinc-500/20'
  }
  if (g.includes('pop') || g.includes('edm') || g.includes('house')) {
    return 'from-fuchsia-500/20 to-fuchsia-600/10 border-fuchsia-500/20'
  }
  let h = 0
  for (let i = 0; i < genre.length; i++) {
    h = genre.charCodeAt(i) + ((h << 5) - h)
  }
  return PALETTE[Math.abs(h) % PALETTE.length]
}

export function SongCard({ song, index = 0 }: SongCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="group"
    >
      <Link href={`/song/${song.id}`}>
        <div
          className={cn(
            'relative p-5 rounded-2xl border glass transition-all duration-300',
            'hover:glow-sm hover:border-primary/30',
            accentForGenre(song.genre)
          )}
        >
          <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center mb-4 overflow-hidden">
            {song.coverImage ? (
              <img
                src={song.coverImage}
                alt={song.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Music className="w-12 h-12 text-muted-foreground/40" />
            )}
          </div>

          <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
            {song.title}
          </h3>
          <p className="text-sm text-muted-foreground truncate">{song.artist}</p>

          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground flex-wrap">
            <span className="px-2 py-1 rounded-lg bg-secondary/50">{song.year}</span>
            <span className="px-2 py-1 rounded-lg bg-secondary/50 max-w-full truncate" title={song.genre}>
              {song.genre}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-3">
            {song.hasTranslation && (
              <div className="flex items-center gap-1 text-xs text-accent">
                <Languages className="w-3 h-3" />
                <span>Translated</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
              <Users className="w-3 h-3" />
              <span>{song.contributionsCount}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
