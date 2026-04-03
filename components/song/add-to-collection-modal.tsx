'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FolderHeart, X, Check } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { updateCollection } from '@/features/collectionSlice'
import { addToast } from '@/features/uiSlice'
import type { Collection } from '@/lib/types/models'

type AddToCollectionModalProps = {
  open: boolean
  onClose: () => void
  songId: string
}

export function AddToCollectionModal({ open, onClose, songId }: AddToCollectionModalProps) {
  const dispatch = useAppDispatch()
  const { collections } = useAppSelector((s) => s.collections)
  const { user } = useAppSelector((s) => s.auth)
  const [pendingId, setPendingId] = useState<string | null>(null)

  const writable = collections.filter(
    (c) => c.ownerUserId == null || c.ownerUserId === user?.id
  )

  const handleAdd = async (col: Collection) => {
    if (col.songIds.includes(songId)) {
      dispatch(addToast({ message: 'Already in this collection', type: 'info' }))
      return
    }
    setPendingId(col.id)
    try {
      const res = await fetch(`/api/collections/${col.id}/songs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songId }),
      })
      const json = (await res.json()) as { collection?: Collection; error?: string }
      if (res.status === 401) {
        dispatch(addToast({ message: 'Sign in to add to a collection', type: 'info' }))
        return
      }
      if (!res.ok) {
        dispatch(addToast({ message: json.error ?? 'Could not add', type: 'error' }))
        return
      }
      if (json.collection) {
        dispatch(updateCollection(json.collection))
        dispatch(addToast({ message: `Added to ${col.name}`, type: 'success' }))
        onClose()
      }
    } catch {
      dispatch(addToast({ message: 'Could not add to collection', type: 'error' }))
    } finally {
      setPendingId(null)
    }
  }

  if (!open) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md p-6 rounded-2xl glass border border-border/50 shadow-2xl max-h-[min(80vh,480px)] flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/20">
                <FolderHeart className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Add to collection</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!user ? (
            <p className="text-sm text-muted-foreground">
              Sign in to organize songs into your collections.
            </p>
          ) : writable.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Create a collection first from the Collections page.
            </p>
          ) : (
            <ul className="space-y-2 overflow-y-auto flex-1 pr-1">
              {writable.map((col) => {
                const has = col.songIds.includes(songId)
                return (
                  <li key={col.id}>
                    <button
                      type="button"
                      disabled={pendingId !== null || has}
                      onClick={() => void handleAdd(col)}
                      className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-border/50 hover:border-primary/40 hover:bg-secondary/30 transition-colors text-left disabled:opacity-60"
                    >
                      <span className="font-medium truncate">{col.name}</span>
                      <span className="text-xs text-muted-foreground shrink-0 flex items-center gap-1">
                        {has ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-primary" />
                            Added
                          </>
                        ) : pendingId === col.id ? (
                          '…'
                        ) : (
                          `${col.songIds.length} songs`
                        )}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
