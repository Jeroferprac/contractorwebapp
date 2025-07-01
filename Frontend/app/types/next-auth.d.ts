// types/next-auth.d.ts
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    backendAccessToken?: string
    userId?: string
  }

  interface JWT {
    backendAccessToken?: string
    userId?: string
  }
}
