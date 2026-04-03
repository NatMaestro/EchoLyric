'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, PenSquare, Send, Share2 } from 'lucide-react'
import { SearchBar } from '@/components/search-bar'
import { SongCard } from '@/components/song-card'
import { useAppSelector } from '@/lib/hooks'
import { TrendingSection } from '@/components/home/trending-section'
import { EraSlider } from '@/components/home/era-slider'
import { CategoryGrid } from '@/components/home/category-grid'
import { FeaturedCollections } from '@/components/home/featured-collections'

export default function HomePage() {
  const { recentlyAdded } = useAppSelector((state) => state.songs)
  const steps = [
    {
      icon: Send,
      title: 'Contribute forgotten songs',
      description:
        'Submit the song details and any lyric lines you remember so the community can help recover the full lyrics.',
    },
    {
      icon: PenSquare,
      title: 'Community edits and improves',
      description:
        'Other listeners refine lines, fix mistakes, and add missing parts using their own knowledge.',
    },
    {
      icon: CheckCircle2,
      title: 'Vote and review for accuracy',
      description:
        'Contributions get reviewed and approved so only trusted lyric versions are published in the archive.',
    },
    {
      icon: Share2,
      title: 'Publish and share',
      description:
        'Approved lyrics go live for everyone to read, search, save, and share across generations.',
    },
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto space-y-6"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-balance">
            <span className="text-glow">Discover</span> &{' '}
            <span className="text-primary">Preserve</span>
            <br />
            Song Lyrics
          </h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-xl mx-auto">
            Recover forgotten lyrics together: contribute songs you cannot fully remember, help edit lines you know,
            and support accurate versions through community review.
          </p>
          
          <div className="pt-4">
            <SearchBar large autoFocus />
          </div>
        </motion.div>

        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl -z-10" />
      </section>

      {/* How it Works */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold">How Echolyric Works</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto text-pretty">
            Built for songs people remember in pieces. The community rebuilds lyrics step by step, then reviews and
            approves them before they become part of the public archive.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl border border-border/50 glass p-5"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold leading-snug">{step.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 text-pretty">{step.description}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Trending Lyrics */}
      <TrendingSection />

      {/* Explore by Era */}
      <EraSlider />

      {/* Categories */}
      <CategoryGrid />

      {/* Featured collections (public) */}
      <FeaturedCollections />

      {/* Recently Added */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold">Recently Added</h2>
          <p className="text-muted-foreground mt-1">Fresh contributions from the community</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentlyAdded.map((song, index) => (
            <SongCard key={song.id} song={song} index={index} />
          ))}
        </div>
      </section>
    </div>
  )
}
