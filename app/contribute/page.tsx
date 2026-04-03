'use client'

import { useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Music, Save, Clock, Languages, Plus, Trash2, GripVertical } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { addToast } from '@/features/uiSlice'
import { GenreCombobox } from '@/components/genre-combobox'
import { DEFAULT_GENRE } from '@/lib/constants/genres'

interface LyricLine {
  id: string
  text: string
  translation: string
  timestamp: string
}

function ContributeContent() {
  const searchParams = useSearchParams()
  const songId = searchParams.get('songId')
  const dispatch = useAppDispatch()
  const { songs } = useAppSelector((state) => state.songs)

  const song = songId ? songs.find(s => s.id === songId) : null

  const [songTitle, setSongTitle] = useState(song?.title || '')
  const [artist, setArtist] = useState(song?.artist || '')
  const [year, setYear] = useState(song?.year?.toString() || '')
  const [genre, setGenre] = useState(song?.genre || DEFAULT_GENRE)
  const [lines, setLines] = useState<LyricLine[]>([
    { id: '1', text: '', translation: '', timestamp: '' },
    { id: '2', text: '', translation: '', timestamp: '' },
    { id: '3', text: '', translation: '', timestamp: '' },
  ])

  const addLine = () => {
    const newLine: LyricLine = {
      id: Date.now().toString(),
      text: '',
      translation: '',
      timestamp: '',
    }
    setLines([...lines, newLine])
  }

  const removeLine = (id: string) => {
    if (lines.length > 1) {
      setLines(lines.filter(line => line.id !== id))
    }
  }

  const updateLine = (id: string, field: keyof LyricLine, value: string) => {
    setLines(lines.map(line => 
      line.id === id ? { ...line, [field]: value } : line
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/contributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          songId: song?.id ?? null,
          songTitle: songTitle || song?.title,
          artist: artist || song?.artist,
          year: year ? Number(year) : song?.year,
          genre: genre || song?.genre,
          lines: lines.map(({ id, text, translation, timestamp }) => ({
            id,
            text,
            translation,
            timestamp,
          })),
        }),
      })
      const json = (await res.json()) as { ok?: boolean; error?: string }
      if (!res.ok) {
        dispatch(addToast({ message: json.error ?? 'Submission failed', type: 'error' }))
        return
      }
      dispatch(addToast({ message: 'Lyrics submitted for review!', type: 'success' }))
    } catch {
      dispatch(addToast({ message: 'Submission failed', type: 'error' }))
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Link href={song ? `/song/${song.id}` : '/'}>
          <motion.button
            whileHover={{ x: -4 }}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </motion.button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold">
            {song ? `Edit: ${song.title}` : 'Contribute Lyrics'}
          </h1>
          <p className="text-muted-foreground mt-1">
            Help preserve music history by adding accurate lyrics
          </p>
        </motion.div>
      </div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        {/* Song Details */}
        {!song && (
          <div className="p-6 rounded-2xl glass border border-border/50 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-primary/20">
                <Music className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">Song Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Song Title</label>
                <input
                  type="text"
                  value={songTitle}
                  onChange={(e) => setSongTitle(e.target.value)}
                  placeholder="Enter song title"
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Artist</label>
                <input
                  type="text"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="Enter artist name"
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Year</label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="e.g., 1999"
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="space-y-2 ">
                <label htmlFor="contribute-genre" className="text-sm font-medium text-muted-foreground">
                  Genre
                </label>
                <GenreCombobox id="contribute-genre" value={genre} onChange={setGenre} />
              </div>
            </div>
          </div>
        )}

        {/* Lyrics Editor */}
        <div className="p-6 rounded-2xl glass border border-border/50 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-accent/20">
                <Languages className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-lg font-semibold">Lyrics</h2>
            </div>
            <span className="text-sm text-muted-foreground">{lines.length} lines</span>
          </div>

          {/* Header Row */}
          <div className="grid grid-cols-[auto_1fr_1fr_100px_auto] gap-4 px-2 text-sm text-muted-foreground">
            <div className="w-6" />
            <span>Original</span>
            <span>Translation (optional)</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Time
            </span>
            <div className="w-10" />
          </div>

          {/* Lines */}
          <div className="space-y-3">
            {lines.map((line, index) => (
              <motion.div
                key={line.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="grid grid-cols-[auto_1fr_1fr_100px_auto] gap-4 items-center group"
              >
                <div className="cursor-grab text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                  <GripVertical className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={line.text}
                  onChange={(e) => updateLine(line.id, 'text', e.target.value)}
                  placeholder={`Line ${index + 1}`}
                  className="px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 outline-none focus:border-primary/50 transition-colors"
                />
                <input
                  type="text"
                  value={line.translation}
                  onChange={(e) => updateLine(line.id, 'translation', e.target.value)}
                  placeholder="Translation"
                  className="px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 outline-none focus:border-accent/50 transition-colors"
                />
                <input
                  type="text"
                  value={line.timestamp}
                  onChange={(e) => updateLine(line.id, 'timestamp', e.target.value)}
                  placeholder="0:00"
                  className="px-3 py-3 rounded-xl bg-secondary/50 border border-border/50 outline-none focus:border-primary/50 transition-colors text-center font-mono text-sm"
                />
                <motion.button
                  type="button"
                  onClick={() => removeLine(line.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ))}
          </div>

          {/* Add Line */}
          <motion.button
            type="button"
            onClick={addLine}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full py-3 rounded-xl border-2 border-dashed border-border/50 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Line
          </motion.button>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Link href={song ? `/song/${song.id}` : '/'}>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-xl bg-secondary/50 hover:bg-secondary text-foreground font-medium transition-colors"
            >
              Cancel
            </motion.button>
          </Link>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium"
          >
            <Save className="w-4 h-4" />
            Submit for Review
          </motion.button>
        </div>
      </motion.form>
    </div>
  )
}

export default function ContributePage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="h-10 w-48 bg-secondary/50 rounded animate-pulse" />
        <div className="h-64 w-full bg-secondary/50 rounded-2xl animate-pulse" />
        <div className="h-96 w-full bg-secondary/50 rounded-2xl animate-pulse" />
      </div>
    }>
      <ContributeContent />
    </Suspense>
  )
}
