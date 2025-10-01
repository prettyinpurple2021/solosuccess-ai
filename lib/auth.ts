import { betterAuth } from "better-auth"
import type { BetterAuthOptions } from "better-auth"

// Lazy initialization to prevent database connection during build
let _auth: ReturnType<typeof betterAuth> | null = null

// Auth configuration
const authConfig: BetterAuthOptions = {
  database: {
    provider: "postgresql" as const,
    url: process.env.DATABASE_URL || "",
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: false,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
  },
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET || "development-secret-key",
  
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  
  trustedOrigins: [
    process.env.NODE_ENV === "production" 
      ? "https://solosuccess.ai" 
      : "http://localhost:3000"
  ],
}

// Lazy getter to initialize auth only when needed (at runtime, not build time)
export function getAuth() {
  if (!_auth) {
    _auth = betterAuth(authConfig)
  }
  return _auth
}

// For backwards compatibility, export as auth but lazily initialized
export const auth = new Proxy({} as ReturnType<typeof betterAuth>, {
  get(target, prop) {
    return getAuth()[prop as keyof ReturnType<typeof betterAuth>]
  }
})

export default auth
