import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import AzureADProvider from "next-auth/providers/azure-ad"

// Environment variables with fallbacks
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "development-secret-key"
const MICROSOFT_CLIENT_ID = process.env.MICROSOFT_CLIENT_ID || process.env.AZURE_AD_CLIENT_ID
const MICROSOFT_CLIENT_SECRET = process.env.MICROSOFT_CLIENT_SECRET || process.env.AZURE_AD_CLIENT_SECRET
const MICROSOFT_TENANT_ID = process.env.MICROSOFT_TENANT_ID || process.env.AZURE_AD_TENANT_ID

// Check if we have the required credentials
const hasCredentials = MICROSOFT_CLIENT_ID && MICROSOFT_CLIENT_SECRET && MICROSOFT_TENANT_ID

const authOptions: NextAuthOptions = {
  providers: hasCredentials
    ? [
        AzureADProvider({
          clientId: MICROSOFT_CLIENT_ID!,
          clientSecret: MICROSOFT_CLIENT_SECRET!,
          tenantId: MICROSOFT_TENANT_ID!,
        }),
      ]
    : [],
  secret: NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token
        // Determine role based on email domain
        token.role = (profile as any).email?.endsWith("@nextphaseit.com") ? "admin" : "user"
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        ;(session as any).accessToken = token.accessToken
        if (session.user) {
          ;(session.user as any).role = token.role
        }
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
