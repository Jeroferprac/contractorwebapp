// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import type { NextAuthOptions } from "next-auth"
import { API } from "@/lib/api"

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, account, user }) {
      console.log("JWT callback - token:", token);
      console.log("JWT callback - account:", account);
      console.log("JWT callback - user:", user);

      if (account && user) {
        token.accessToken = account.access_token
        token.id = user.id

        try {
          const res = await fetch(API.OAUTH_CALLBACK("github"), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${account.access_token}`,
            },
            body: JSON.stringify({
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
              accessToken: account.access_token,
            }),
          })

          if (!res.ok) {
            console.error("❌ Backend sync failed:", await res.text())
          }
        } catch (err) {
          console.error("❌ Backend sync error:", err)
        }
      }
      return token
    },

    async session({ session, token }) {
      console.log("Session callback - session:", session);
      console.log("Session callback - token:", token);

      session.accessToken = token.accessToken as string
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },

    async redirect({ baseUrl }) {
      console.log("Redirect callback - baseUrl:", baseUrl);
      return baseUrl + "/dashboard"
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
