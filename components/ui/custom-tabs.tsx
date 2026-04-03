'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Tab {
  id: string
  label: string
  count?: number
}

interface CustomTabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (tabId: string) => void
}

export function CustomTabs({ tabs, activeTab, onChange }: CustomTabsProps) {
  return (
    <div className="flex items-center gap-2 p-1 rounded-xl bg-secondary/30 w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'relative px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            activeTab === tab.id
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-secondary rounded-lg"
              transition={{ type: 'spring', duration: 0.4 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            {tab.label}
            {tab.count !== undefined && (
              <span className="px-1.5 py-0.5 text-xs rounded-md bg-primary/20 text-primary">
                {tab.count}
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  )
}
