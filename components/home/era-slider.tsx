'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import Link from 'next/link'

const eras = [
  { decade: '1970s', label: 'The Golden Age', color: 'from-amber-500/20 to-orange-600/20' },
  { decade: '1980s', label: 'Highlife Era', color: 'from-emerald-500/20 to-teal-600/20' },
  { decade: '1990s', label: 'The Revolution', color: 'from-blue-500/20 to-indigo-600/20' },
  { decade: '2000s', label: 'Hiplife Rise', color: 'from-purple-500/20 to-pink-600/20' },
  { decade: '2010s', label: 'Digital Age', color: 'from-rose-500/20 to-red-600/20' },
  { decade: '2020s', label: 'New Wave', color: 'from-cyan-500/20 to-blue-600/20' },
]

export function EraSlider() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-accent/20">
            <Clock className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Explore by Era</h2>
            <p className="text-muted-foreground">Travel through music history</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll('left')}
            className="p-2 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll('right')}
            className="p-2 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-8 px-8"
      >
        {eras.map((era, index) => (
          <motion.div
            key={era.decade}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="flex-shrink-0"
          >
            <Link href={`/search?era=${era.decade}`}>
              <div className={`w-72 h-40 rounded-2xl bg-gradient-to-br ${era.color} border border-border/50 glass p-6 flex flex-col justify-between hover:border-primary/30 hover:glow-sm transition-all duration-300`}>
                <span className="text-4xl font-bold">{era.decade}</span>
                <span className="text-muted-foreground">{era.label}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
