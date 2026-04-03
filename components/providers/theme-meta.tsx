'use client'

import { useTheme } from 'next-themes'
import { useEffect } from 'react'

export function ThemeMeta() {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const themeColor = resolvedTheme === 'dark' ? '#1a1625' : '#fafafa'
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      meta.setAttribute('content', themeColor)
    }
  }, [resolvedTheme])

  return null
}
