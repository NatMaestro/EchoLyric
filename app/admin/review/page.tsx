import { auth } from '@/auth'
import { canReviewLyricSubmissions } from '@/lib/auth/roles'
import { ReviewQueue } from '@/components/admin/review-queue'
import { repoListPendingContributions } from '@/lib/data/repository'
import { redirect } from 'next/navigation'

export default async function AdminReviewPage() {
  const session = await auth()
  if (!session?.user?.id || !canReviewLyricSubmissions(session.user.role)) {
    redirect('/')
  }

  const rows = await repoListPendingContributions()

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Review submissions</h1>
        <p className="text-muted-foreground mt-1">
          Lyric contributions queued as <span className="font-medium text-foreground">pending</span>.
          Approve or reject after you verify the content.
        </p>
      </div>
      <ReviewQueue initialRows={rows} />
    </div>
  )
}
