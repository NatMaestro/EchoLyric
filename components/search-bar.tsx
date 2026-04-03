'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Sparkles, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setSearchQuery } from '@/features/songSlice'
import { toggleMemorySearchMode } from '@/features/uiSlice'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  large?: boolean
  autoFocus?: boolean
}

export function SearchBar({ large = false, autoFocus = false }: SearchBarProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const searchQuery = useAppSelector((state) => state.songs.searchQuery)
  const isMemoryMode = useAppSelector((state) => state.ui.isMemorySearchMode)
  const [localQuery, setLocalQuery] = useState(searchQuery)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (localQuery.trim()) {
      dispatch(setSearchQuery(localQuery))
      router.push(`/search?q=${encodeURIComponent(localQuery)}`)
    }
  }

  const handleClear = () => {
    setLocalQuery('')
    dispatch(setSearchQuery(''))
    inputRef.current?.focus()
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <motion.div
        initial={false}
        className={cn(
          'relative flex items-center gap-3 glass rounded-2xl border border-border/50 transition-all duration-300',
          large ? 'px-6 py-5' : 'px-4 py-3',
          isMemoryMode && 'border-primary/50 glow'
        )}
      >
        <Search className={cn(
          'text-muted-foreground flex-shrink-0',
          large ? 'w-6 h-6' : 'w-5 h-5'
        )} />
        
        <input
          ref={inputRef}
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          autoFocus={autoFocus}
          placeholder={isMemoryMode 
            ? "Type a memory... \"that song about family from the 90s\"" 
            : "Search songs, lyrics, or even a memory..."}
          className={cn(
            'flex-1 bg-transparent outline-none placeholder:text-muted-foreground/60',
            large ? 'text-lg' : 'text-base'
          )}
        />

        <AnimatePresence>
          {localQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              type="button"
              onClick={handleClear}
              className="p-1 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </motion.button>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={() => dispatch(toggleMemorySearchMode())}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'p-2 rounded-xl transition-all duration-300',
            isMemoryMode 
              ? 'bg-primary/20 text-primary' 
              : 'hover:bg-secondary/50 text-muted-foreground hover:text-foreground'
          )}
          title="Memory Search Mode"
        >
          <Sparkles className={cn('w-5 h-5', isMemoryMode && 'animate-pulse')} />
        </motion.button>

        <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-secondary/50 text-muted-foreground text-xs">
          <kbd className="font-mono">Ctrl</kbd>
          <span>+</span>
          <kbd className="font-mono">K</kbd>
        </div>
      </motion.div>

      {/* Memory Search Hint */}
      <AnimatePresence>
        {isMemoryMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-3 left-0 right-0 text-center"
          >
            <span className="text-sm text-primary/80">
              Memory Mode Active - Describe what you remember
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  )
}
