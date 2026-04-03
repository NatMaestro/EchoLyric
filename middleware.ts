import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import { canReviewLyricSubmissions } from '@/lib/auth/roles'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isAdmin = pathname.startsWith('/admin')
  const isContribute = pathname.startsWith('/contribute')

  if (!req.auth && (isAdmin || isContribute)) {
    const signIn = new URL('/signin', req.url)
    signIn.searchParams.set('callbackUrl', `${pathname}${req.nextUrl.search}`)
    return NextResponse.redirect(signIn)
  }

  if (isAdmin && !canReviewLyricSubmissions(req.auth?.user?.role)) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/contribute', '/contribute/:path*', '/admin', '/admin/:path*'],
}
