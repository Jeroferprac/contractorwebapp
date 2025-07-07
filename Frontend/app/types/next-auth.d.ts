import "next-auth";

declare module "next-auth" {
  interface Session {

    user: {
      name?: string | null
      email?: string | null
      image?: string | null
      backendToken?: string      // ✅ required for session.user.backendToken
      userId?: string
    }
  }

  interface User {
    backendToken?: string
    userId?: string

  }

  interface User {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {

    backendToken?: string
    userId?: string

  }
}
