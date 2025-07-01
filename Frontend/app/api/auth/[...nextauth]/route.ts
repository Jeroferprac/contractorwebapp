import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import { API } from "@/lib/api"
import { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, account }) {
      // Only on initial login
      if (account?.provider === "github" && account.access_token) {
        const githubAccessToken = account.access_token

        const redirectUri =
          process.env.NEXT_PUBLIC_REDIRECT_URI ??
          `${process.env.NEXTAUTH_URL}/api/auth/callback/github`

        const backendURL = API.OAUTH_CALLBACK("github", githubAccessToken, redirectUri)

        console.log("✅ GitHub Access Token:", githubAccessToken)
        console.log("🌐 Redirect URI:", redirectUri)
        console.log("🔄 Calling backend at:", backendURL)

        try {
          const response = await fetch(backendURL, { method: "GET" })
          const data = await response.json()

          console.log("📦 Backend Response:", data)

          if (!response.ok) {
            console.error("❌ Backend Error:", data)
            throw new Error(data?.message || "Backend GitHub auth failed")
          }

          token.backendAccessToken = data.access_token ?? undefined
          token.userId = data.user?.id ?? undefined
        } catch (error) {
          console.error("🚨 GitHub backend sync failed:", error)
        }
      }

      return token // ✅ always return token
    },

    async session({ session, token }) {
      console.log("⚙️ Populating session from token")
      session.backendAccessToken = token.backendAccessToken ?? undefined
      session.userId = token.userId ?? undefined
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
