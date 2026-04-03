'use client'

import { motion } from 'framer-motion'
import { Languages, FileQuestion, AlertTriangle, Plus } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { toggleTranslation, setHighlightedLine } from '@/features/lyricsSlice'
import { LyricsLine } from './lyrics-line'
import Link from 'next/link'

interface LyricsViewerProps {
  songId: string
}

function lineLooksIncomplete(text: string): boolean {
  const value = text.trim().toLowerCase()
  if (!value) return true

  // Common placeholders contributors use for unknown/missing lyric parts.
  const markers = ['???', '…', '...', '[missing]', '[unknown]', '[inaudible]', '[unclear]', 'tbd']
  if (markers.some((m) => value.includes(m))) return true

  // Placeholder-like punctuation / blanks such as "____", "---", "... ...".
  if (/^[_\-\.\s]{3,}$/.test(value)) return true

  // Uncertain line fragments often end like "something ?" or "word??".
  if (/[?]{1,}$/.test(value) && value.length <= 24) return true

  // Very short bracketed notes, e.g. "[missing line]".
  if (/^\[[^\]]{0,30}\]$/.test(value)) return true

  return false
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
  const incompleteCount = currentVersion
    ? currentVersion.lines.filter((line) => lineLooksIncomplete(line.text)).length
    : 0
  const hasIncompleteLyrics = incompleteCount > 0

  return (
    <div className="space-y-6">
      {hasIncompleteLyrics && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-amber-700 dark:text-amber-300">
                  Some lines are still incomplete
                </p>
                <p className="text-sm text-amber-700/90 dark:text-amber-300/90">
                  {incompleteCount} line{incompleteCount === 1 ? '' : 's'} need completion. Add what you know to help
                  finish this song.
                </p>
              </div>
            </div>
            <Link
              href={`/contribute?songId=${songId}`}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-sm font-medium text-amber-800 dark:text-amber-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Contribute missing lines
            </Link>
          </div>
        </motion.div>
      )}

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
