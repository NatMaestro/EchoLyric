'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { canReviewLyricSubmissions } from '@/lib/auth/roles'
import { repoReviewLyricSubmission } from '@/lib/data/repository'

export async function reviewLyricSubmission(
  submissionId: string,
  status: 'approved' | 'rejected'
): Promise<{ ok: boolean; error?: string }> {
  const session = await auth()
  if (!session?.user?.id || !canReviewLyricSubmissions(session.user.role)) {
    return { ok: false, error: 'Unauthorized' }
  }

  const result = await repoReviewLyricSubmission(submissionId, status, session.user.id)
  if (!result.ok) {
    return { ok: false, error: result.error ?? 'Update failed' }
  }

  revalidatePath('/admin/review')
  revalidatePath('/')
  if (result.songId) {
    revalidatePath(`/song/${result.songId}`)
  }
  return { ok: true }
}
