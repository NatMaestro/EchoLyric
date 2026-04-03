'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Music2, Lock, Globe } from 'lucide-react'
import type { Collection } from '@/features/collectionSlice'

interface CollectionCardProps {
  collection: Collection
  index?: number
}

export function CollectionCard({ collection, index = 0 }: CollectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="group"
    >
      <Link href={`/collections/${collection.id}`}>
        <div className="relative p-6 rounded-2xl border border-border/50 glass hover:border-primary/30 hover:glow-sm transition-all duration-300">
          {/* Cover Grid */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center"
              >
                <Music2 className="w-6 h-6 text-muted-foreground/30" />
              </div>
            ))}
          </div>

          {/* Info */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {collection.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {collection.songIds.length} songs
              </p>
            </div>
            <div className="flex-shrink-0">
              {collection.isPublic ? (
                <Globe className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Lock className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          </div>

          {collection.description && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
              {collection.description}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
