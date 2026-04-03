'use client'

import { motion } from 'framer-motion'

export function SkeletonCard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-5 rounded-2xl border border-border/50 glass"
    >
      <div className="w-full aspect-square rounded-xl bg-secondary/50 animate-pulse mb-4" />
      <div className="h-5 w-3/4 bg-secondary/50 rounded animate-pulse mb-2" />
      <div className="h-4 w-1/2 bg-secondary/50 rounded animate-pulse mb-3" />
      <div className="flex gap-2">
        <div className="h-6 w-12 bg-secondary/50 rounded-lg animate-pulse" />
        <div className="h-6 w-16 bg-secondary/50 rounded-lg animate-pulse" />
      </div>
    </motion.div>
  )
}

export function SkeletonLine({ width = '100%' }: { width?: string }) {
  return (
    <div 
      className="h-4 bg-secondary/50 rounded animate-pulse"
      style={{ width }}
    />
  )
}
