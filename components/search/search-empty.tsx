'use client'

import { motion } from 'framer-motion'
import { SearchX, PenLine } from 'lucide-react'
import Link from 'next/link'

interface SearchEmptyProps {
  query: string
}

export function SearchEmpty({ query }: SearchEmptyProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-20 h-20 rounded-2xl bg-secondary/50 flex items-center justify-center mb-6">
        <SearchX className="w-10 h-10 text-muted-foreground/50" />
      </div>
      
      <h3 className="text-xl font-semibold mb-2">
        We couldn&apos;t find that...
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        No results found for &quot;{query}&quot;. Maybe it&apos;s a song waiting to be preserved?
      </p>
      
      <Link href="/contribute">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
        >
          <PenLine className="w-5 h-5" />
          <span>Contribute it</span>
        </motion.button>
      </Link>
    </motion.div>
  )
}
