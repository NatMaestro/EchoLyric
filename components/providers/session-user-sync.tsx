'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { setUser } from '@/features/authSlice'
import { hydrateFavorites } from '@/features/favoritesSlice'
import { useAppDispatch } from '@/lib/hooks'

/** Clears Redux auth when NextAuth reports signed-out (e.g. client sign-out). */
export function SessionUserSync() {
  const { status } = useSession()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (status === 'unauthenticated') {
      dispatch(setUser(null))
      dispatch(hydrateFavorites([]))
    }
  }, [status, dispatch])

  return null
}
