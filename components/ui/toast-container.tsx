'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { removeToast } from '@/features/uiSlice'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
}

const styles = {
  success: 'border-green-500/30 bg-green-500/10',
  error: 'border-red-500/30 bg-red-500/10',
  info: 'border-primary/30 bg-primary/10',
}

export function ToastContainer() {
  const dispatch = useAppDispatch()
  const toasts = useAppSelector((state) => state.ui.toasts)

  useEffect(() => {
    toasts.forEach((toast) => {
      const timer = setTimeout(() => {
        dispatch(removeToast(toast.id))
      }, 4000)
      return () => clearTimeout(timer)
    })
  }, [toasts, dispatch])

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-100 flex w-[calc(100vw-2rem)] max-w-[420px] flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.type]
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className={cn(
                'flex w-full items-center gap-3 px-4 py-3 rounded-xl glass border backdrop-blur-xl shadow-xl',
                styles[toast.type]
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="flex-1 text-sm font-medium">{toast.message}</span>
              <button
                onClick={() => dispatch(removeToast(toast.id))}
                className="p-1 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
