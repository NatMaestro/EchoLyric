'use client'

import { motion } from 'framer-motion'
import { Lightbulb, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useAppSelector } from '@/lib/hooks'

interface MemorySuggestionsProps {
  query: string
}

export function MemorySuggestions({ query }: MemorySuggestionsProps) {
  const suggestions = useAppSelector((state) => state.ui.memorySuggestions)

  const relevantSuggestions = suggestions.filter((s) =>
    query.toLowerCase().split(' ').some((word) =>
      s.original.toLowerCase().includes(word)
    )
  )

  if (relevantSuggestions.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="p-4 rounded-xl glass border border-primary/20 space-y-3">
        <div className="flex items-center gap-2 text-primary">
          <Lightbulb className="w-4 h-4" />
          <span className="text-sm font-medium">Did you mean...</span>
        </div>
        
        <div className="space-y-2">
          {relevantSuggestions.map((suggestion) => (
            <Link key={suggestion.songId} href={`/song/${suggestion.songId}`}>
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors group"
              >
                <div>
                  <span className="text-muted-foreground text-sm line-through mr-2">
                    {suggestion.original}
                  </span>
                  <ArrowRight className="inline w-3 h-3 text-muted-foreground mx-1" />
                  <span className="font-medium">{suggestion.match}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
