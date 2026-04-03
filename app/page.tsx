'use client'

import { motion } from 'framer-motion'
import { SearchBar } from '@/components/search-bar'
import { SongCard } from '@/components/song-card'
import { useAppSelector } from '@/lib/hooks'
import { TrendingSection } from '@/components/home/trending-section'
import { EraSlider } from '@/components/home/era-slider'
import { CategoryGrid } from '@/components/home/category-grid'
import { FeaturedCollections } from '@/components/home/featured-collections'

export default function HomePage() {
  const { recentlyAdded } = useAppSelector((state) => state.songs)

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
            A digital archive for finding and preserving lyrics—especially old and hard-to-find songs that deserve to be remembered.
          </p>
          
          <div className="pt-4">
            <SearchBar large autoFocus />
          </div>
        </motion.div>

        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl -z-10" />
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
