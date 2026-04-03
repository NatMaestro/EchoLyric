'use client'

import { motion } from 'framer-motion'
import { Languages, FileQuestion } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { toggleTranslation, setHighlightedLine } from '@/features/lyricsSlice'
import { LyricsLine } from './lyrics-line'
import Link from 'next/link'

interface LyricsViewerProps {
  songId: string
}

export function LyricsViewer({ songId }: LyricsViewerProps) {
  const dispatch = useAppDispatch()
  const { currentLyrics, showTranslation, highlightedLine } = useAppSelector((state) => state.lyrics)

  if (!currentLyrics) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mb-4">
          <FileQuestion className="w-8 h-8 text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No lyrics yet</h3>
        <p className="text-muted-foreground mb-6">Be the first to add lyrics for this song!</p>
        <Link href={`/contribute?songId=${songId}`}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-xl bg-primary/20 text-primary font-medium"
          >
            Contribute Lyrics
          </motion.button>
        </Link>
      </motion.div>
    )
  }

  const currentVersion = currentLyrics.versions.find(v => v.id === currentLyrics.currentVersion)
  const hasTranslation = currentVersion?.lines.some(line => line.translation)

  return (
    <div className="space-y-6">
      {/* Controls */}
      {hasTranslation && (
        <div className="flex items-center justify-center">
          <motion.button
            onClick={() => dispatch(toggleTranslation())}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
              showTranslation
                ? 'bg-accent/20 text-accent border border-accent/30'
                : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
            }`}
          >
            <Languages className="w-4 h-4" />
            <span>{showTranslation ? 'Hide Translation' : 'Show Translation'}</span>
          </motion.button>
        </div>
      )}

      {/* Lyrics */}
      <div className="max-w-2xl mx-auto space-y-1">
        {currentVersion?.lines.map((line, index) => (
          <LyricsLine
            key={line.id}
            line={line}
            index={index}
            showTranslation={showTranslation}
            isHighlighted={highlightedLine === index}
            onHover={() => dispatch(setHighlightedLine(index))}
            onLeave={() => dispatch(setHighlightedLine(null))}
          />
        ))}
      </div>

      {/* Language Info */}
      <div className="text-center text-sm text-muted-foreground pt-8">
        <span>Original: {currentLyrics.originalLanguage}</span>
        {currentLyrics.translatedLanguage && (
          <span className="ml-4">Translation: {currentLyrics.translatedLanguage}</span>
        )}
      </div>
    </div>
  )
}
