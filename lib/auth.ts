import { betterAuth } from "better-auth"

// Edge runtime compatible Better Auth configuration  
export const auth = betterAuth({
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
})

export default auth
