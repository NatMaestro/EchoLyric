'use client'

import { use, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Music,
  Calendar,
  Tag,
  Languages,
  Edit,
  Plus,
  BookOpen,
  MessageCircle,
  History,
  Heart,
  Share2,
} from 'lucide-react'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setSelectedSong } from '@/features/songSlice'
import { setCurrentLyrics } from '@/features/lyricsSlice'
import { addFavoriteId, removeFavoriteId } from '@/features/favoritesSlice'
import { addToast } from '@/features/uiSlice'
import { LyricsViewer } from '@/components/song/lyrics-viewer'
import { SongStory } from '@/components/song/song-story'
import { SongComments } from '@/components/song/song-comments'
import { SongVersions } from '@/components/song/song-versions'
import { AddToCollectionModal } from '@/components/song/add-to-collection-modal'
import { CustomTabs } from '@/components/ui/custom-tabs'

export default function SongPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const dispatch = useAppDispatch()
  const { songs } = useAppSelector((state) => state.songs)
  const { currentLyrics, comments } = useAppSelector((state) => state.lyrics)
  const { user } = useAppSelector((state) => state.auth)
  const favoriteIds = useAppSelector((state) => state.favorites.songIds)
  const [activeSection, setActiveSection] = useState('lyrics')
  const [collectionOpen, setCollectionOpen] = useState(false)
  const [favoriteBusy, setFavoriteBusy] = useState(false)

  const isFavorite = favoriteIds.includes(id)

  const toggleFavorite = async () => {
    if (!user) {
      dispatch(addToast({ message: 'Sign in to save favorites', type: 'info' }))
      return
    }
    setFavoriteBusy(true)
    try {
      if (isFavorite) {
        const res = await fetch(`/api/favorites?songId=${encodeURIComponent(id)}`, {
          method: 'DELETE',
        })
        if (!res.ok) {
          dispatch(addToast({ message: 'Could not remove favorite', type: 'error' }))
          return
        }
        dispatch(removeFavoriteId(id))
        dispatch(addToast({ message: 'Removed from favorites', type: 'success' }))
      } else {
        const res = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ songId: id }),
        })
        if (res.status === 401) {
          dispatch(addToast({ message: 'Sign in to save favorites', type: 'info' }))
          return
        }
        if (!res.ok) {
          dispatch(addToast({ message: 'Could not save favorite', type: 'error' }))
          return
        }
        dispatch(addFavoriteId(id))
        dispatch(addToast({ message: 'Saved to favorites', type: 'success' }))
      }
    } catch {
      dispatch(addToast({ message: 'Something went wrong', type: 'error' }))
    } finally {
      setFavoriteBusy(false)
    }
  }

  const shareSong = async () => {
    const s = songs.find((x) => x.id === id)
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const title = `${s?.title ?? 'Song'} — ${s?.artist ?? ''}`
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ title, text: title, url })
        return
      }
      await navigator.clipboard.writeText(url)
      dispatch(addToast({ message: 'Link copied', type: 'success' }))
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') return
      dispatch(addToast({ message: 'Could not share', type: 'error' }))
    }
  }

  const song = songs.find((s) => s.id === id)
  const songComments = comments[id] || []

  useEffect(() => {
    if (song) {
      dispatch(setSelectedSong(song))
      dispatch(setCurrentLyrics(song.id))
    }
  }, [song, dispatch])

  if (!song) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Music className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Song not found</h2>
        <p className="text-muted-foreground mb-6">This song doesn&apos;t exist or has been removed.</p>
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/20 text-primary"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back home
          </motion.button>
        </Link>
      </div>
    )
  }

  const sections = [
    { id: 'lyrics', label: 'Lyrics', icon: BookOpen },
    { id: 'versions', label: 'Versions', icon: History },
    { id: 'story', label: 'Story', icon: BookOpen },
    { id: 'comments', label: 'Comments', icon: MessageCircle, count: songComments.length },
  ]

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link href="/">
        <motion.button
          whileHover={{ x: -4 }}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </motion.button>
      </Link>

      {/* Song Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row gap-8"
      >
        {/* Cover */}
        <div className="w-full md:w-64 aspect-square rounded-2xl bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center flex-shrink-0 glow-sm">
          {song.coverImage ? (
            <img 
              src={song.coverImage} 
              alt={song.title}
              className="w-full h-full object-cover rounded-2xl"
            />
          ) : (
            <Music className="w-20 h-20 text-muted-foreground/30" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-glow">{song.title}</h1>
            <p className="text-xl text-muted-foreground mt-2">{song.artist}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/50 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              {song.year}
            </span>
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/50 text-sm">
              <Tag className="w-4 h-4 text-muted-foreground" />
              {song.genre}
            </span>
            {song.hasTranslation && (
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-accent/20 text-accent text-sm">
                <Languages className="w-4 h-4" />
                Translation Available
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4">
            <motion.button
              type="button"
              disabled={favoriteBusy}
              onClick={() => void toggleFavorite()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-colors ${
                isFavorite
                  ? 'bg-primary/20 text-primary border border-primary/40'
                  : 'bg-secondary/50 hover:bg-secondary text-foreground'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-primary' : ''}`} />
              {isFavorite ? 'Saved' : 'Favorite'}
            </motion.button>
            <motion.button
              type="button"
              onClick={() => void shareSong()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary/50 hover:bg-secondary text-foreground font-medium transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </motion.button>
            <Link href={`/contribute?songId=${song.id}`}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium"
              >
                <Edit className="w-4 h-4" />
                Edit Lyrics
              </motion.button>
            </Link>
            <motion.button
              type="button"
              onClick={() => setCollectionOpen(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary/50 hover:bg-secondary text-foreground font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add to Collection
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Content Sections */}
      <div className="space-y-6">
        <CustomTabs
          tabs={sections.map(s => ({ id: s.id, label: s.label, count: s.count }))}
          activeTab={activeSection}
          onChange={setActiveSection}
        />

        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeSection === 'lyrics' && <LyricsViewer songId={song.id} />}
          {activeSection === 'versions' && <SongVersions songId={song.id} />}
          {activeSection === 'story' && <SongStory songId={song.id} />}
          {activeSection === 'comments' && <SongComments songId={song.id} />}
        </motion.div>
      </div>

      <AddToCollectionModal
        open={collectionOpen}
        onClose={() => setCollectionOpen(false)}
        songId={song.id}
      />
    </div>
  )
}
