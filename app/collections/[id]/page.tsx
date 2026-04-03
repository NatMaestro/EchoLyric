'use client'

import { use } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, FolderHeart, Globe, Lock, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useAppSelector } from '@/lib/hooks'
import { SongCard } from '@/components/song-card'

export default function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { collections } = useAppSelector((state) => state.collections)
  const { songs } = useAppSelector((state) => state.songs)

  const collection = collections.find((c) => c.id === id)

  if (!collection) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <FolderHeart className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Collection not found</h2>
        <p className="text-muted-foreground mb-6">This collection doesn&apos;t exist or has been removed.</p>
        <Link href="/collections">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/20 text-primary"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Collections
          </motion.button>
        </Link>
      </div>
    )
  }

  const collectionSongs = songs.filter((song) => collection.songIds.includes(song.id))

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link href="/collections">
        <motion.button
          whileHover={{ x: -4 }}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Collections</span>
        </motion.button>
      </Link>

      {/* Collection Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl glass border border-border/50"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
              <FolderHeart className="w-10 h-10 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold">{collection.name}</h1>
                {collection.isPublic ? (
                  <Globe className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Lock className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              {collection.description && (
                <p className="text-muted-foreground">{collection.description}</p>
              )}
              <p className="text-sm text-muted-foreground mt-2">
                {collectionSongs.length} songs • Created {collection.createdAt}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 rounded-xl bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              <Edit className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 rounded-xl bg-secondary/50 hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Songs Grid */}
      {collectionSongs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collectionSongs.map((song, index) => (
            <SongCard key={song.id} song={song} index={index} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mb-4">
            <FolderHeart className="w-8 h-8 text-muted-foreground/30" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Collection is empty</h3>
          <p className="text-muted-foreground mb-6">
            Start adding songs to this collection
          </p>
          <Link href="/search">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-xl bg-primary/20 text-primary font-medium"
            >
              Browse Songs
            </motion.button>
          </Link>
        </motion.div>
      )}
    </div>
  )
}
