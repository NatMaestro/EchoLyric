'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, FolderHeart } from 'lucide-react'
import { CollectionCard } from '@/components/collection-card'
import { useAppSelector } from '@/lib/hooks'

export function FeaturedCollections() {
  const { collections } = useAppSelector((state) => state.collections)
  const featured = collections.filter((c) => c.isPublic).slice(0, 4)

  if (featured.length === 0) {
    return null
  }

  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/20">
            <FolderHeart className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Featured collections</h2>
            <p className="text-muted-foreground mt-1">Curated sets from the archive</p>
          </div>
        </div>
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline shrink-0"
        >
          See all
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featured.map((collection, index) => (
          <CollectionCard key={collection.id} collection={collection} index={index} />
        ))}
      </div>
    </section>
  )
}
