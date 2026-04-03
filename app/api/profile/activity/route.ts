import { NextResponse } from 'next/server'
import { PROFILE_ACTIVITY } from '@/lib/data/catalog'

export async function GET() {
  return NextResponse.json({ activity: PROFILE_ACTIVITY })
}
