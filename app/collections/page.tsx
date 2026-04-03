'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, FolderHeart, X, LogIn } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { CollectionCard } from '@/components/collection-card'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { addCollection, Collection } from '@/features/collectionSlice'
import { addToast } from '@/features/uiSlice'

const collectionsSignInHref = '/signin?callbackUrl=%2Fcollections'

export default function CollectionsPage() {
  const { data: session } = useSession()
  const canCreate = Boolean(session?.user)
  const dispatch = useAppDispatch()
  const { collections } = useAppSelector((state) => state.collections)
  const [isCreating, setIsCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return

    try {
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          description: newDescription.trim() || undefined,
          songIds: [],
          isPublic: true,
          createdAt: new Date().toISOString().split('T')[0],
        }),
      })
      const json = (await res.json()) as { collection?: Collection; error?: string }
      if (!res.ok) {
        dispatch(addToast({ message: json.error ?? 'Could not create collection', type: 'error' }))
        return
      }
      if (json.collection) {
        dispatch(addCollection(json.collection))
        dispatch(addToast({ message: 'Collection created!', type: 'success' }))
        setNewName('')
        setNewDescription('')
        setIsCreating(false)
      }
    } catch {
      dispatch(addToast({ message: 'Could not create collection', type: 'error' }))
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold">Collections</h1>
          <p className="text-muted-foreground mt-1">Organize your favorite lyrics</p>
        </div>

        <motion.button
          onClick={() => setIsCreating(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium"
        >
          <Plus className="w-4 h-4" />
          New Collection
        </motion.button>
      </motion.div>

      {/* Create Modal */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsCreating(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md p-6 rounded-2xl glass border border-border/50 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/20">
                    <FolderHeart className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">New Collection</h2>
                </div>
                <motion.button
                  onClick={() => setIsCreating(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="My Favorite Songs"
                    autoFocus
                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Description (optional)</label>
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="A collection of..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 outline-none focus:border-primary/50 transition-colors resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <motion.button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-3 rounded-xl bg-secondary/50 hover:bg-secondary text-foreground font-medium transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={!newName.trim()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collections Grid */}
      {collections.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {collections.map((collection, index) => (
            <CollectionCard key={collection.id} collection={collection} index={index} />
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-secondary/50 flex items-center justify-center mb-6">
            <FolderHeart className="w-10 h-10 text-muted-foreground/30" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No collections yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            {canCreate
              ? 'Create your first collection to start organizing your favorite lyrics'
              : 'Sign in to create collections and organize your favorite lyrics'}
          </p>
          {canCreate ? (
            <motion.button
              onClick={() => setIsCreating(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/20 text-primary font-medium"
            >
              <Plus className="w-4 h-4" />
              Create Collection
            </motion.button>
          ) : (
            <Link
              href={collectionsSignInHref}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/20 text-primary font-medium"
            >
              <LogIn className="w-4 h-4" />
              Sign in to create
            </Link>
          )}
        </motion.div>
      )}
    </div>
  )
}
