'use client'

import { useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { SearchBar } from '@/components/search-bar'
import { SongCard } from '@/components/song-card'
import { CustomTabs } from '@/components/ui/custom-tabs'
import { SkeletonCard } from '@/components/ui/skeleton-card'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setSearchQuery, setSearchResults, setLoading } from '@/features/songSlice'
import { searchSongsWithLyrics } from '@/lib/data/catalog'
import { setActiveTab } from '@/features/uiSlice'
import { SearchEmpty } from '@/components/search/search-empty'
import { MemorySuggestions } from '@/components/search/memory-suggestions'
import { Sparkles, Music, FileText, User } from 'lucide-react'

function SearchContent() {
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const { searchResults, searchQuery, songs, isLoading } = useAppSelector((state) => state.songs)
  const lyrics = useAppSelector((state) => state.lyrics.lyrics)
  const { activeTab, isMemorySearchMode } = useAppSelector((state) => state.ui)

  useEffect(() => {
    const query = searchParams.get('q')
    const genre = searchParams.get('genre')
    const era = searchParams.get('era')

    if (query) {
      dispatch(setSearchQuery(query))
    } else if (genre) {
      dispatch(setSearchQuery(genre))
    } else if (era) {
      dispatch(setSearchQuery(era))
    }
  }, [searchParams, dispatch])

  useEffect(() => {
    const q = searchQuery.trim()
    if (!q) {
      dispatch(setSearchResults([]))
      return
    }
    let cancelled = false
    dispatch(setLoading(true))
    fetch(`/api/songs/search?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((data: { results?: typeof songs }) => {
        if (cancelled) return
        dispatch(setSearchResults(data.results ?? []))
      })
      .catch(() => {
        if (cancelled) return
        dispatch(setSearchResults(searchSongsWithLyrics(songs, lyrics, q)))
      })
      .finally(() => {
        if (!cancelled) dispatch(setLoading(false))
      })
    return () => {
      cancelled = true
    }
  }, [searchQuery, dispatch, songs, lyrics])

  const tabs = [
    { id: 'songs', label: 'Songs', count: searchResults.length },
    { id: 'lyrics', label: 'Lyrics', count: 0 },
    { id: 'artists', label: 'Artists', count: 0 },
  ]

  const hasResults = searchResults.length > 0
  const hasQuery = searchQuery.trim().length > 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold">Search</h1>
          <p className="text-muted-foreground mt-1">Find songs, lyrics, and artists</p>
        </div>

        <SearchBar />

        {/* Memory Mode Suggestions */}
        <AnimatePresence>
          {isMemorySearchMode && hasQuery && (
            <MemorySuggestions query={searchQuery} />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Results Section */}
      {hasQuery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Tabs */}
          <div className="flex items-center justify-between">
            <CustomTabs
              tabs={tabs}
              activeTab={activeTab}
              onChange={(tab) => dispatch(setActiveTab(tab))}
            />
            
            {(hasResults || isLoading) && (
              <span className="text-sm text-muted-foreground">
                {isLoading
                  ? 'Searching…'
                  : `${searchResults.length} result${searchResults.length !== 1 ? 's' : ''} for "${searchQuery}"`}
              </span>
            )}
          </div>

          {/* Results Grid */}
          <AnimatePresence mode="wait">
            {hasResults ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {searchResults.map((song, index) => (
                  <SongCard key={song.id} song={song} index={index} />
                ))}
              </motion.div>
            ) : !isLoading ? (
              <SearchEmpty query={searchQuery} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[0, 1, 2, 3].map((i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Default State - Show All Songs */}
      {!hasQuery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <Sparkles className="w-4 h-4" />
            <span>Browse all available songs</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {songs.map((song, index) => (
              <SongCard key={song.id} song={song} index={index} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="space-y-8">
        <div className="space-y-6">
          <div className="h-10 w-48 bg-secondary/50 rounded animate-pulse" />
          <div className="h-14 w-full bg-secondary/50 rounded-2xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
