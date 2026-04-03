'use client'

import { useTransition } from 'react'
import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { reviewLyricSubmission } from '@/lib/admin/actions'
import { addToast } from '@/features/uiSlice'
import { useAppDispatch } from '@/lib/hooks'
import type { PendingContributionRow } from '@/lib/db/queries'

export function ReviewQueue({ initialRows }: { initialRows: PendingContributionRow[] }) {
  const dispatch = useAppDispatch()
  const [pending, startTransition] = useTransition()

  function act(id: string, status: 'approved' | 'rejected') {
    startTransition(() => {
      void (async () => {
        const res = await reviewLyricSubmission(id, status)
        if (!res.ok) {
          dispatch(addToast({ message: res.error ?? 'Update failed', type: 'error' }))
          return
        }
        dispatch(
          addToast({
            message:
              status === 'approved'
                ? 'Approved — lyrics are now live in the archive'
                : 'Submission rejected',
            type: 'success',
          })
        )
        window.location.reload()
      })()
    })
  }

  if (initialRows.length === 0) {
    return (
      <p className="text-muted-foreground py-12 text-center">No submissions awaiting review.</p>
    )
  }

  return (
    <ul className="space-y-4">
      {initialRows.map((row, i) => (
        <motion.li
          key={row.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          className="p-4 rounded-2xl glass border border-border/50 space-y-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
            <span className="font-mono text-xs">{row.id}</span>
            <span>{row.createdAt}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Submitter user id: {row.userId ?? '—'}
          </p>
          <pre className="text-xs bg-secondary/40 rounded-lg p-3 overflow-x-auto max-h-48 overflow-y-auto whitespace-pre-wrap">
            {JSON.stringify(row.payload, null, 2)}
          </pre>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={() => act(row.id, 'approved')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              Approve
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => act(row.id, 'rejected')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-foreground text-sm font-medium disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              Reject
            </button>
          </div>
        </motion.li>
      ))}
    </ul>
  )
}
