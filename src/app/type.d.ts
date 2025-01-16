import type { DefaultUser, DefaultJWT } from 'next-auth'

export interface CustomUser extends DefaultUser {
  id?: string
  role?: string
}
interface CustomSession extends CustomUser {}

interface CustomJWT extends DefaultJWT, CustomUser {}

declare module 'next-auth' {
  interface Session {
    user?: CustomSession
  }

  interface User extends CustomSession {}
}

declare module 'next-auth/jwt' {
  interface JWT extends CustomJWT {}
}
