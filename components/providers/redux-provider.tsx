'use client'

import { useEffect, useRef } from 'react'
import { Provider } from 'react-redux'
import { hydrateFromApi } from '@/features/hydration'
import { useAppDispatch } from '@/lib/hooks'
import { store } from '@/lib/store'
import { SessionUserSync } from '@/components/providers/session-user-sync'

function ApiHydration({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true
    void dispatch(hydrateFromApi())
  }, [dispatch])

  return <>{children}</>
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SessionUserSync />
      <ApiHydration>{children}</ApiHydration>
    </Provider>
  )
}
