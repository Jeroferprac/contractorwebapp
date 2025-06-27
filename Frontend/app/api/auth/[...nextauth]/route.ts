import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { NextAuthOptions } from "next-auth"
import { API } from "@/lib/api"


export const authOptions: NextAuthOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        token.accessToken = account.access_token
        token.id = user.id

        try {
          await fetch(API.OAUTH_CALLBACK("github"), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
              accessToken: account.access_token,
            }),
          })
        } catch (err) {
          console.error("❌ Failed to sync user to backend:", err)
        }
      }

      return token
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },

    async redirect({ baseUrl }) {
      return baseUrl + "/dashboard"
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
