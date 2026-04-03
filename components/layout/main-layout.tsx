'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Sidebar } from './sidebar'
import { FloatingActionButton } from '../ui/floating-action-button'
import { ToastContainer } from '../ui/toast-container'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setSidebarCollapsed } from '@/features/uiSlice'
import { AdSlot } from '@/components/ads/ad-slot'

export function MainLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const collapsed = useAppSelector((state) => state.ui.sidebarCollapsed)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // On mobile, default to hidden drawer. On desktop, default to expanded.
  useEffect(() => {
    if (isMobile) dispatch(setSidebarCollapsed(true))
    else dispatch(setSidebarCollapsed(false))
  }, [isMobile, dispatch])

  const marginLeft = isMobile ? 0 : collapsed ? 80 : 280

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Sidebar />
      <motion.main
        initial={false}
        animate={{ marginLeft }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="min-h-screen"
      >
        <div className="px-4 py-4 sm:px-8 sm:py-8 max-w-7xl mx-auto">
          <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-8">
            <div className="min-w-0">
              {children}
              <div className="mt-8 xl:hidden">
                <AdSlot
                  slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_MOBILE_INLINE}
                  format="horizontal"
                />
              </div>
            </div>

            <aside className="hidden xl:block">
              <div className="sticky top-6">
                <AdSlot
                  slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_DESKTOP_RAIL}
                  format="vertical"
                  className="min-h-[280px]"
                />
              </div>
            </aside>
          </div>
        </div>
      </motion.main>
      <FloatingActionButton />
      <ToastContainer />
    </div>
  )
}
