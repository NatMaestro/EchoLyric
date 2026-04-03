'use client'

import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export function FloatingActionButton() {
  return (
    <Link href="/contribute">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center glow z-50 shadow-xl"
      >
        <Plus className="w-6 h-6 text-primary-foreground" />
        <span className="sr-only">Add Lyrics</span>
      </motion.button>
    </Link>
  )
}
