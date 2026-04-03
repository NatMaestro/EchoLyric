import type { DefaultSession } from 'next-auth'
import type { AppUserRole } from '@/lib/auth/roles'

declare module 'next-auth' {
  interface User {
    role?: AppUserRole
  }

  interface Session {
    user: DefaultSession['user'] & {
      id: string
      role: AppUserRole
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    appUserId?: string
    role?: AppUserRole
  }
}
