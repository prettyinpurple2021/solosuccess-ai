import { createAuthClient } from "better-auth/client"
import { twoFactorClient } from "better-auth/client/plugins"
import { passkeyClient } from "better-auth/client/plugins"
import { emailOTPClient } from "better-auth/client/plugins"
import { multiSessionClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: process.env.NODE_ENV === "production" 
    ? "https://solosuccess.ai" 
    : "http://localhost:3000",
  plugins: [
    // Two Factor Authentication client
    twoFactorClient({
      onTwoFactorRedirect: () => {
        if (typeof window !== 'undefined') {
          window.location.href = "/auth/2fa"
        }
      },
    }),
    // Passkey/WebAuthn client
    passkeyClient(),
    // Email OTP client
    emailOTPClient(),
    // Multi-session client
    multiSessionClient(),
  ],
})

export const { signIn, signUp, signOut, useSession, getSession, useUser } = authClient