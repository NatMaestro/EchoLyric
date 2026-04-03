'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { LyricsLine as LyricsLineType } from '@/features/lyricsSlice'

interface LyricsLineProps {
  line: LyricsLineType
  index: number
  showTranslation: boolean
  isHighlighted: boolean
  onHover: () => void
  onLeave: () => void
}

export function LyricsLine({
  line,
  index,
  showTranslation,
  isHighlighted,
  onHover,
  onLeave,
}: LyricsLineProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={cn(
        'py-3 px-4 rounded-xl transition-all duration-200 cursor-default',
        isHighlighted
          ? 'bg-primary/10 scale-[1.02]'
          : 'hover:bg-secondary/30'
      )}
    >
      <p
        className={cn(
          'text-lg md:text-xl text-center leading-relaxed transition-all duration-200',
          isHighlighted ? 'text-primary text-glow' : 'text-foreground'
        )}
      >
        {line.text}
      </p>
      
      <AnimatePresence>
        {showTranslation && line.translation && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-sm md:text-base text-center text-muted-foreground mt-1 italic"
          >
            {line.translation}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
