'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Disc, Mic2, Music, Radio } from 'lucide-react'
import { FEATURED_GENRE_CATEGORIES } from '@/lib/constants/genres'

const icons = {
  disc: Disc,
  mic: Mic2,
  music: Music,
  radio: Radio,
} as const

export function CategoryGrid() {
  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold">Browse by Genre</h2>
        <p className="text-muted-foreground mt-1">
          Popular entry points — search supports the full genre list
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {FEATURED_GENRE_CATEGORIES.map((category, index) => {
          const Icon = icons[category.iconKey]
          const href = `/search?genre=${encodeURIComponent(category.name)}`
          return (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <Link href={href}>
                <div
                  className={`relative p-6 rounded-2xl bg-gradient-to-br ${category.color} border border-border/50 glass hover:border-primary/30 hover:glow-sm transition-all duration-300 h-full min-h-[140px]`}
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-foreground/80" />
                  </div>

                  <h3 className="text-lg font-semibold mb-1 leading-snug">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
