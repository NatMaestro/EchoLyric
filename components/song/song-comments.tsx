'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Heart, Send, User } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { addComment, patchComment, Comment } from '@/features/lyricsSlice'
import { addToast } from '@/features/uiSlice'

interface SongCommentsProps {
  songId: string
}

export function SongComments({ songId }: SongCommentsProps) {
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const { comments } = useAppSelector((state) => state.lyrics)
  const { user } = useAppSelector((state) => state.auth)
  const [newComment, setNewComment] = useState('')
  const signedIn = Boolean(user)
  const signInHref = `/signin?callbackUrl=${encodeURIComponent(pathname || '/')}`

  const songComments = comments[songId] || []
  const [likingId, setLikingId] = useState<string | null>(null)

  const handleLike = async (commentId: string) => {
    if (!signedIn) {
      dispatch(addToast({ message: 'Sign in to like comments', type: 'info' }))
      return
    }
    setLikingId(commentId)
    try {
      const res = await fetch(`/api/songs/${songId}/comments/${commentId}/like`, {
        method: 'POST',
      })
      const json = (await res.json()) as { likes?: number; likedByMe?: boolean; error?: string }
      if (!res.ok) {
        dispatch(addToast({ message: json.error ?? 'Could not update like', type: 'error' }))
        return
      }
      if (json.likes != null && json.likedByMe != null) {
        dispatch(
          patchComment({
            songId,
            commentId,
            likes: json.likes,
            likedByMe: json.likedByMe,
          })
        )
      }
    } catch {
      dispatch(addToast({ message: 'Could not update like', type: 'error' }))
    } finally {
      setLikingId(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      const res = await fetch(`/api/songs/${songId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newComment }),
      })
      const json = (await res.json()) as { comment?: Comment; error?: string }
      if (res.status === 401) {
        dispatch(addToast({ message: 'Sign in to post a comment', type: 'info' }))
        return
      }
      if (!res.ok) {
        dispatch(addToast({ message: json.error ?? 'Could not post comment', type: 'error' }))
        return
      }
      if (json.comment) {
        dispatch(addComment({ songId, comment: json.comment }))
        dispatch(addToast({ message: 'Comment added!', type: 'success' }))
        setNewComment('')
      }
    } catch {
      dispatch(addToast({ message: 'Could not post comment', type: 'error' }))
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Comment Input */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="p-4 rounded-2xl glass border border-border/50"
      >
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1 space-y-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this song..."
              rows={3}
              className="w-full bg-transparent resize-none outline-none placeholder:text-muted-foreground/60"
            />
            {!signedIn && (
              <p className="text-xs text-muted-foreground">
                <Link href={signInHref} className="text-primary hover:underline">
                  Sign in
                </Link>{' '}
                to post — your name comes from your account.
              </p>
            )}
            <div className="flex justify-end">
              <motion.button
                type="submit"
                disabled={!newComment.trim() || !signedIn}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                Post
              </motion.button>
            </div>
          </div>
        </div>
      </motion.form>

      {/* Comments List */}
      <div className="space-y-4">
        <AnimatePresence>
          {songComments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <MessageCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No comments yet. Be the first!</p>
            </motion.div>
          ) : (
            songComments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-2xl glass border border-border/50"
              >
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{comment.username}</span>
                      <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
                    </div>
                    <p className="text-muted-foreground">{comment.text}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <motion.button
                        type="button"
                        disabled={likingId === comment.id}
                        onClick={() => void handleLike(comment.id)}
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.94 }}
                        className={`flex items-center gap-1 text-sm transition-colors ${
                          comment.likedByMe
                            ? 'text-primary'
                            : 'text-muted-foreground hover:text-primary'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${comment.likedByMe ? 'fill-primary' : ''}`} />
                        <span>{comment.likes}</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
