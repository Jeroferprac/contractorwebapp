import type { DefaultSession, DefaultUser } from "next-auth"; // ✅ import types only

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      backendToken?: string;
      userId?: string;
    };
  }

  interface User extends DefaultUser {
    id: string;
    backendToken?: string;
    userId?: string;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendAccessToken?: string;
    backendToken?: string;
    userId?: string;
    accessToken?: string;
  }
}
