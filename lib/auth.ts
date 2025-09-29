import { betterAuth } from "better-auth"
import { twoFactor } from "better-auth/plugins"
import { passkey } from "better-auth/plugins"
import { emailOTP } from "better-auth/plugins"
import { multiSession } from "better-auth/plugins"
import { rateLimit } from "better-auth/plugins"
import { session } from "better-auth/plugins"
import { database } from "better-auth/plugins"
import { logger } from "@/lib/logger"

export const auth = betterAuth({
  database: {
    provider: "postgresql",
    url: process.env.DATABASE_URL!,
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  plugins: [
    // Two Factor Authentication
    twoFactor({
      issuer: "SoloSuccess AI",
      backupCodes: {
        enabled: true,
        count: 10,
      },
    }),
    // Passkey/WebAuthn support
    passkey({
      rpName: "SoloSuccess AI",
      rpID: process.env.NODE_ENV === "production" ? "solosuccess.ai" : "localhost",
      origin: process.env.NODE_ENV === "production" ? "https://solosuccess.ai" : "http://localhost:3000",
    }),
    // Email OTP for passwordless auth
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        // TODO: Implement email sending service
        logger.info(`OTP for ${email}: ${otp} (${type})`)
      },
    }),
    // Multi-session support with device management
    multiSession({
      maxSessions: 10,
      deviceTracking: true,
      deviceFingerprinting: true,
    }),
    // Rate limiting
    rateLimit({
      window: "1m",
      max: 10,
      storage: "memory",
    }),
    // Session management
    session({
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5, // 5 minutes
      },
    }),
    // Database plugin
    database({
      provider: "postgresql",
      url: process.env.DATABASE_URL!,
    }),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  cookies: {
    sessionToken: {
      name: "better-auth.session-token",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
    callbackUrl: {
      name: "better-auth.callback-url",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 5, // 5 minutes
    },
    csrfToken: {
      name: "better-auth.csrf-token",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
    },
  },
  trustedOrigins: [
    process.env.NODE_ENV === "production" 
      ? "https://solosuccess.ai" 
      : "http://localhost:3000"
  ],
  logger: {
    level: process.env.NODE_ENV === "production" ? "error" : "info",
    disabled: false,
  },
  advanced: {
    generateId: () => crypto.randomUUID(),
    crossSubDomainCookies: {
      enabled: false,
    },
    useSecureCookies: process.env.NODE_ENV === "production",
  },
})

export default auth