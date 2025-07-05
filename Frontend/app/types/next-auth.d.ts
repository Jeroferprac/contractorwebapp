import "next-auth";

declare module "next-auth" {
  interface Session {
    backendAccessToken?: string;
  }

  interface User {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}
