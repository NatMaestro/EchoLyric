'use client'

import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import { SongCard } from '@/components/song-card'
import { useAppSelector } from '@/lib/hooks'

export function TrendingSection() {
  const { trending } = useAppSelector((state) => state.songs)

  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-3 mb-6"
      >
        <div className="p-2 rounded-xl bg-primary/20">
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Trending Lyrics</h2>
          <p className="text-muted-foreground">Most searched this week</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {trending.map((song, index) => (
          <SongCard key={song.id} song={song} index={index} />
        ))}
      </div>
    </section>
  )
}
