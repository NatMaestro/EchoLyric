'use client'

import { motion } from 'framer-motion'
import { Sidebar } from './sidebar'
import { FloatingActionButton } from '../ui/floating-action-button'
import { ToastContainer } from '../ui/toast-container'
import { useAppSelector } from '@/lib/hooks'

export function MainLayout({ children }: { children: React.ReactNode }) {
  const collapsed = useAppSelector((state) => state.ui.sidebarCollapsed)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <motion.main
        initial={false}
        animate={{ marginLeft: collapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="min-h-screen"
      >
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </motion.main>
      <FloatingActionButton />
      <ToastContainer />
    </div>
  )
}
