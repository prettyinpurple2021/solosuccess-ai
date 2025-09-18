import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'
import { z } from "zod"


/**
 * Environment variable validation schema for the SoloSuccess AI Platform
 * Validates all required configuration values for production deployment
 */
const envSchema = z.object({
  // Database - Required for core functionality
  DATABASE_URL: z.string().min(1, "Neon database URL is required"),
  
  // JWT Authentication - Required for authentication
  JWT_SECRET: z.string().min(32, "JWT secret must be at least 32 characters"),
  
  // Stack Auth - Optional (for backward compatibility)
  NEXT_PUBLIC_STACK_PROJECT_ID: z.string().min(1, "Stack Auth project ID is required").optional(),
  NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY: z.string().min(1, "Stack Auth publishable key is required").optional(),
  STACK_SECRET_SERVER_KEY: z.string().min(1, "Stack Auth secret key is required").optional(),



  // AI Services - Optional for AI functionality
  OPENAI_API_KEY: z.string().min(1, "OpenAI API key is required").optional(),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1, "Google Gemini API key is required").optional(),

  // Email - Optional for notifications
  RESEND_API_KEY: z.string().min(1, "Resend API key is required").optional(),
  FROM_EMAIL: z.string().email("Invalid from email address").optional(),

  // App Configuration - Required
  NEXT_PUBLIC_APP_URL: z.string().url("Invalid app URL"),
  NEXTAUTH_URL: z.string().url("Invalid NextAuth URL").optional(),
  
  // Environment
  NODE_ENV: z.enum(["development", "production", "test"]).optional(),
})

/**
 * Validates environment variables with proper error handling
 * @returns Validated environment configuration or throws error
 */
export function validateEnv() {
  try {
    const env = envSchema.parse(process.env)
    if (process.env.NODE_ENV === "development") {
      logInfo("✅ Environment variables validated successfully")
    }
    return env
  } catch (error) {
    if (error instanceof z.ZodError) {
      logError("❌ Environment variable validation failed:")
      error.errors.forEach((err) => {
        logError(`  - ${err.path.join(".")}: ${err.message}`)
      })
      
      // In development, show helpful setup messages
      if (process.env.NODE_ENV !== "production") {
        logError("\n📝 Setup Instructions:")
        logError("  1. Copy .env.example to .env.local")
        logError("  2. Fill in your actual environment values")
        logError("  3. Restart your development server")
        logError("\n🔗 Documentation: Check README.md for detailed setup instructions")
      }
      
      // Do not crash build by default. Opt-in via VALIDATE_ENV=true.
      if (process.env.VALIDATE_ENV === "true") {
        throw new Error("Environment validation failed")
      }
    }
    throw error
  }
}

/**
 * Check if required environment variables are available for runtime
 * @param keys Array of required environment variable keys
 * @returns Boolean indicating if all keys are present
 */
export function checkRequiredEnvVars(keys: string[]): boolean {
  return keys.every(key => process.env[key] && process.env[key]!.length > 0)
}

/**
 * Get feature flags based on environment variables
 */
export function getFeatureFlags() {
  return {
    hasDatabase: !!process.env.DATABASE_URL,
    hasAuth: !!(process.env.JWT_SECRET || (process.env.NEXT_PUBLIC_STACK_PROJECT_ID && process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY)),
    hasBilling: false, // Chargebee removed
    hasAI: !!(process.env.OPENAI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY),
    hasEmail: !!process.env.RESEND_API_KEY,
  }
}

// Only validate when explicitly requested
if (process.env.VALIDATE_ENV === "true") {
  validateEnv()
}
