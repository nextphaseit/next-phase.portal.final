import NextAuth from "next-auth"
import AzureADProvider from "next-auth/providers/azure-ad"
import { config } from "@/lib/config"

// Determine which Microsoft credentials to use
const microsoftClientId = config.auth.microsoft.clientId || config.auth.nextAuth.clientId
const microsoftClientSecret = config.auth.microsoft.clientSecret || config.auth.nextAuth.clientSecret
const microsoftTenantId = config.auth.microsoft.tenantId || config.auth.nextAuth.tenantId

const authOptions = {
  providers: [
    AzureADProvider({
      clientId: microsoftClientId!,
      clientSecret: microsoftClientSecret!,
      tenantId: microsoftTenantId!,
    }),
  ],
  secret: config.auth.secret,
  callbacks: {
    async jwt({ token, account, profile }: any) {
      if (account && profile) {
        token.accessToken = account.access_token
        // Determine role based on email domain or profile
        token.role = profile.email?.endsWith("@nextphaseit.com") ? "admin" : "user"
      }
      return token
    },
    async session({ session, token }: any) {
      if (token) {
        session.accessToken = token.accessToken
        session.user.role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
