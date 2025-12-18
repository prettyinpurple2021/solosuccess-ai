import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard') || nextUrl.pathname.startsWith('/admin')
      
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      }
      
      return true
    },
    async jwt({ token, user, trigger, session }) {
        if (user) {
            token.id = user.id
            if ('role' in user) token.role = user.role;
            if ('subscription_tier' in user) token.subscription_tier = user.subscription_tier;
        }
        if (trigger === "update" && session) {
            token = { ...token, ...session }
        }
        return token
    },
    async session({ session, token }) {
        if (token && session.user) {
            session.user.id = token.id as string
            // @ts-ignore
            session.user.role = token.role as string
            // @ts-ignore
            session.user.subscription_tier = token.subscription_tier as string
        }
        return session
    },
  },
  providers: [], // Configured in auth.ts
} satisfies NextAuthConfig
