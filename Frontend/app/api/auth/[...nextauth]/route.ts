import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

interface User {
  id: string;
  name: string;
  email: string;
  backendToken?: string;
}

interface Token {
  backendToken?: string;
}

interface Session {
  user: {
    id: string;
    name: string;
    email: string;
    backendToken?: string;
  };
  backendToken?: string;
}

const handler = NextAuth({
  ...authOptions,
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        try {
          const response = await fetch("http://localhost:8000/api/v1/users/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              password: "", // This will be handled by the credentials provider
            }),
          });

          if (response.ok) {
            const data = await response.json();
            return {
              ...token,
              backendToken: data.access_token,
            };
          }
        } catch (error) {
          console.error("Error in jwt callback:", error);
        }
      }

      // Return previous token if the access token has not expired yet
      if (user && user.backendToken) {
        token.backendToken = user.backendToken;
      }

      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token.backendToken) {
        session.backendToken = token.backendToken;
        if (session.user) {
          session.user.backendToken = token.backendToken;
        }
      }

      return session;
    },
  },
});

export { handler as GET, handler as POST };