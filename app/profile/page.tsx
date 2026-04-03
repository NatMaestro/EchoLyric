'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { User, Calendar, Edit, Music, FileText, MessageCircle, Settings, LogOut } from 'lucide-react'
import { useAppSelector } from '@/lib/hooks'
import { UserBadge } from '@/components/user-badge'
import { SongCard } from '@/components/song-card'

const contributionIcons = {
  lyrics: Music,
  translation: FileText,
  correction: Edit,
  comment: MessageCircle,
}

export default function ProfilePage() {
  const { user } = useAppSelector((state) => state.auth)
  const { songs } = useAppSelector((state) => state.songs)
  const { songIds: favoriteIds } = useAppSelector((state) => state.favorites)
  const { activity: profileActivity } = useAppSelector((state) => state.profile)

  const savedSongs = favoriteIds
    .map((id) => songs.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))

  // Get user's contributed songs (mock data)
  const contributedSongs = songs.slice(0, 3)

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <User className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Not signed in</h2>
        <p className="text-muted-foreground mb-6">Sign in to view your profile</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/signin?callbackUrl=%2Fprofile"
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium"
          >
            Sign in
          </Link>
          <Link
            href="/signup?callbackUrl=%2Fprofile"
            className="px-6 py-3 rounded-xl border border-border font-medium hover:bg-secondary/50 transition-colors"
          >
            Create account
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-2xl glass border border-border/50"
      >
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center glow-sm">
              <User className="w-16 h-16 text-primary" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold">{user.username}</h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 rounded-xl bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Settings className="w-4 h-4" />
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 rounded-xl bg-secondary/50 hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6">
              <div className="p-4 rounded-xl bg-secondary/30">
                <p className="text-3xl font-bold text-primary">{user.contributions}</p>
                <p className="text-sm text-muted-foreground">Contributions</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/30">
                <p className="text-3xl font-bold">{user.badges.length}</p>
                <p className="text-sm text-muted-foreground">Badges</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/30 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Joined</p>
                  <p className="text-sm text-muted-foreground">{user.joinedAt}</p>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {user.badges.map((badge) => (
                <UserBadge key={badge} badge={badge} size="md" />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Saved favorites */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold">Saved songs</h2>
          <p className="text-muted-foreground mt-1">Lyrics you&apos;ve favorited</p>
        </motion.div>
        {savedSongs.length === 0 ? (
          <p className="text-muted-foreground text-sm py-4">
            Tap the heart on a song page to save it here.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedSongs.map((song, index) => (
              <SongCard key={song.id} song={song} index={index} />
            ))}
          </div>
        )}
      </section>

      {/* Recent Activity */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold">Recent Activity</h2>
          <p className="text-muted-foreground mt-1">Your recent contributions</p>
        </motion.div>

        <div className="space-y-3">
          {profileActivity.map((contribution, index) => {
            const Icon = contributionIcons[contribution.type as keyof typeof contributionIcons]
            return (
              <motion.div
                key={contribution.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-xl glass border border-border/50 hover:border-primary/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {contribution.action}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {contribution.songTitle}
                  </p>
                </div>
                <span className="text-sm text-muted-foreground flex-shrink-0">
                  {contribution.date}
                </span>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Contributed Songs */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold">Your Contributions</h2>
          <p className="text-muted-foreground mt-1">Songs you&apos;ve helped preserve</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {contributedSongs.map((song, index) => (
            <SongCard key={song.id} song={song} index={index} />
          ))}
        </div>
      </section>
    </div>
  )
}
