'use client'

import { motion } from 'framer-motion'
import { BookOpen, PenLine } from 'lucide-react'
import { useAppSelector } from '@/lib/hooks'
import Link from 'next/link'

interface SongStoryProps {
  songId: string
}

export function SongStory({ songId }: SongStoryProps) {
  const { currentLyrics } = useAppSelector((state) => state.lyrics)

  if (!currentLyrics?.story) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No story yet</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Know the story behind this song? Share it with the community!
        </p>
        <Link href={`/contribute?songId=${songId}&section=story`}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/20 text-primary font-medium"
          >
            <PenLine className="w-4 h-4" />
            Add Story
          </motion.button>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="p-6 rounded-2xl glass border border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-primary/20">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">The Story Behind the Song</h3>
        </div>
        
        <p className="text-muted-foreground leading-relaxed">
          {currentLyrics.story}
        </p>
      </div>
    </motion.div>
  )
}
