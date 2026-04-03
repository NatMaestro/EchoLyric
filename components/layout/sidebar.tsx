'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Search,
  FolderHeart,
  PenLine,
  User,
  ChevronLeft,
  Music2,
  Menu,
  LogIn,
  LogOut,
  Shield,
  UserPlus,
  X,
} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { toggleSidebar } from '@/features/uiSlice'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/theme-toggle'
import { canReviewLyricSubmissions } from '@/lib/auth/roles'

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/collections', label: 'Collections', icon: FolderHeart },
  { href: '/contribute', label: 'Contribute', icon: PenLine },
  { href: '/profile', label: 'Profile', icon: User },
]

export function Sidebar() {
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const collapsed = useAppSelector((state) => state.ui.sidebarCollapsed)
  const { data: session } = useSession()

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const asideWidth = isMobile ? 'w-[280px]' : collapsed ? 'w-[80px]' : 'w-[280px]'
  const asideTransform = isMobile
    ? collapsed
      ? '-translate-x-full'
      : 'translate-x-0'
    : 'translate-x-0'

  return (
    <>
      {isMobile && !collapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-49"
          role="button"
          aria-label="Close navigation"
          onClick={() => dispatch(toggleSidebar())}
        />
      )}

      {isMobile && collapsed && (
        <button
          type="button"
          className="fixed left-4 top-4 z-60 w-11 h-11 rounded-xl glass border border-border/50 flex items-center justify-center"
          onClick={() => dispatch(toggleSidebar())}
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {isMobile && !collapsed && (
        <button
          type="button"
          className="fixed left-4 top-4 z-60 w-11 h-11 rounded-xl glass border border-border/50 flex items-center justify-center"
          onClick={() => dispatch(toggleSidebar())}
          aria-label="Close navigation"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <motion.aside
        initial={false}
        className={cn(
          'fixed left-0 top-0 h-screen glass border-r border-border/50 z-50 flex flex-col overflow-y-auto transition-transform duration-300 ease-out',
          asideWidth,
          asideTransform
        )}
      >
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-border/30">
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
          className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center glow-sm"
        >
          <Music2 className="w-5 h-5 text-primary-foreground" />
        </motion.div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-xl font-bold text-glow"
            >
              Echolyric
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200',
                  isActive
                    ? 'bg-primary/20 text-primary glow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                )}
              >
                <item.icon className={cn('w-5 h-5 shrink-0', isActive && 'text-primary')} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Auth */}
      <div className="px-4 pb-2 space-y-2 border-b border-border/30">
        {session?.user ? (
          <>
            {canReviewLyricSubmissions(session.user.role) && (
              <Link href="/admin/review">
                <motion.div
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200',
                    pathname.startsWith('/admin')
                      ? 'bg-primary/20 text-primary glow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  )}
                >
                  <Shield className="w-5 h-5 shrink-0" />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="font-medium"
                      >
                        Review queue
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            )}
            <motion.button
              type="button"
              onClick={() => signOut({ callbackUrl: '/' })}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200"
            >
                <LogOut className="w-5 h-5 shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="font-medium"
                  >
                    Sign out
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </>
        ) : (
          <div className="space-y-1">
            <Link href="/signin">
              <motion.div
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-4 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200"
              >
                <LogIn className="w-5 h-5 shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="font-medium"
                    >
                      Sign in
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
            <Link href="/signup">
              <motion.div
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-4 px-4 py-2 rounded-xl text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <UserPlus className="w-5 h-5 shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="font-medium"
                    >
                      Create account
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          </div>
        )}
      </div>

      {/* Theme Toggle & Collapse */}
      <div className="p-4 border-t border-border/30 space-y-2">
        <div className={cn(
          'flex items-center',
          collapsed ? 'justify-center' : 'justify-between'
        )}>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-sm text-muted-foreground"
              >
                Theme
              </motion.span>
            )}
          </AnimatePresence>
          <ThemeToggle />
        </div>
        <motion.button
          onClick={() => dispatch(toggleSidebar())}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          <motion.div
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm"
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.aside>
    </>
  )
}
