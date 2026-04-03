'use client'

import { motion } from 'framer-motion'
import { History, User, ThumbsUp, Check } from 'lucide-react'
import { useAppSelector } from '@/lib/hooks'

interface SongVersionsProps {
  songId: string
}

export function SongVersions({ songId }: SongVersionsProps) {
  const { currentLyrics } = useAppSelector((state) => state.lyrics)

  if (!currentLyrics || currentLyrics.versions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mb-4">
          <History className="w-8 h-8 text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No versions yet</h3>
        <p className="text-muted-foreground">This song has no community edits.</p>
      </motion.div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {currentLyrics.versions.map((version, index) => {
        const isActive = version.id === currentLyrics.currentVersion
        return (
          <motion.div
            key={version.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-5 rounded-2xl glass border transition-all duration-300 ${
              isActive
                ? 'border-primary/50 glow-sm'
                : 'border-border/50 hover:border-primary/30'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{version.contributor}</span>
                    {isActive && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs">
                        <Check className="w-3 h-3" />
                        Active
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">{version.createdAt}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-secondary/50 hover:bg-secondary text-sm transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{version.votes}</span>
                </motion.button>
              </div>
            </div>

            <div className="mt-4 pl-13">
              <p className="text-sm text-muted-foreground">
                {version.lines.length} lines • {version.lines.filter(l => l.translation).length} translated
              </p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
