'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/utils'

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

type AdSlotProps = {
  slot?: string
  className?: string
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle'
}

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim()

export function AdSlot({ slot, className, format = 'auto' }: AdSlotProps) {
  const resolvedSlot = slot?.trim()
  const showPlaceholder =
    !ADSENSE_CLIENT || !resolvedSlot || process.env.NODE_ENV !== 'production'

  useEffect(() => {
    if (showPlaceholder) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // Ignore ad fill/runtime errors to avoid impacting UX.
    }
  }, [showPlaceholder, resolvedSlot])

  if (showPlaceholder) {
    return (
      <div
        className={cn(
          'w-full rounded-xl border border-dashed border-border/70 bg-secondary/25 p-4 text-center text-xs text-muted-foreground',
          className
        )}
      >
        Sponsored area
      </div>
    )
  }

  return (
    <div className={cn('w-full', className)}>
      <p className="mb-2 text-[11px] uppercase tracking-wide text-muted-foreground">Sponsored</p>
      <ins
        className="adsbygoogle block w-full overflow-hidden rounded-xl border border-border/50"
        style={{ minHeight: '120px' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={resolvedSlot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}

