import NextAuth, { NextAuthOptions, User, Account, Profile, Session, TokenSet } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { API } from "@/lib/api" // your backend API wrapper
import type { JWT } from "next-auth/jwt"

interface BackendLoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

interface GithubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
}

declare module "next-auth" {
  interface Session {
    backendAccessToken?: string;
    userId?: string;
  }

  interface User {
    backendAccessToken?: string;
    userId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendAccessToken?: string;
    userId?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Call your backend login API
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });
        const data = await res.json();

        if (res.ok && data.access_token && data.user) {
          // Attach backend token and userId to user object
          return {
            ...data.user,
            backendAccessToken: data.access_token,
            userId: data.user.id,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }: {
      token: JWT,
      user?: User | null,
      account?: Account | null,
      profile?: Profile | undefined
    }): Promise<JWT> {
      // On initial sign in (manual or OAuth)
      if (user && user.backendAccessToken) {
        token.backendAccessToken = user.backendAccessToken;
        token.userId = user.userId;
      }

      // GitHub OAuth logic (already present)
      if (account?.provider === "github" && account.access_token) {
        try {
          const githubAccessToken = account.access_token;

          // 1. Get user profile
          const userProfileResp = await fetch("https://api.github.com/user", {
            headers: { Authorization: `Bearer ${githubAccessToken}` },
          });
          const userProfile = await userProfileResp.json();

          // 2. Get email
          const emailResp = await fetch("https://api.github.com/user/emails", {
            headers: { Authorization: `Bearer ${githubAccessToken}` },
          });
          const emails: GithubEmail[] = await emailResp.json();
          const primaryEmail =
            emails.find((e) => e.primary)?.email ?? userProfile.email;

          // 3. POST to FastAPI backend
          const payload = {
            provider: "github",
            user_info: {
              email: primaryEmail,
              name: userProfile.name || userProfile.login,
              provider_id: String(userProfile.id),
              provider: "github",
            },
          };

          const backendResp = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/oauth/github/callback`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );

          const data: BackendLoginResponse = await backendResp.json();

          if (!backendResp.ok) {
            console.error("❌ Backend Error:", data);
            throw new Error("Backend registration/login failed");
          }

          // 4. Add backend token and ID to token
          token.backendAccessToken = data.access_token;
          token.userId = data.user.id;
        } catch (error) {
          console.error("🚨 GitHub backend sync failed:", error);
        }
      }

      return token;
    },

    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      session.backendAccessToken = token.backendAccessToken;
      session.userId = token.userId;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
