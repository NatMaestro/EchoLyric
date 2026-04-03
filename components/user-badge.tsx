'use client'

import { motion } from 'framer-motion'
import { Award, Star, Clock, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserBadgeProps {
  badge: string
  size?: 'sm' | 'md' | 'lg'
}

const badgeStyles: Record<string, { icon: typeof Award; className: string }> = {
  'Early Adopter': {
    icon: Clock,
    className: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  },
  'Top Contributor': {
    icon: Star,
    className: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  },
  'Archivist': {
    icon: Award,
    className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  },
}

export function UserBadge({ badge, size = 'md' }: UserBadgeProps) {
  const style = badgeStyles[badge] || {
    icon: Sparkles,
    className: 'bg-primary/20 text-primary border-primary/30',
  }
  const Icon = style.icon

  const sizeStyles = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2',
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        sizeStyles[size],
        style.className
      )}
    >
      <Icon className={iconSizes[size]} />
      <span>{badge}</span>
    </motion.span>
  )
}
