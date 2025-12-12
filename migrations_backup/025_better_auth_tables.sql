-- Better Auth Core Tables
-- User table (if not exists)
CREATE TABLE IF NOT EXISTS "user" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT,
  "email" TEXT UNIQUE NOT NULL,
  "emailVerified" BOOLEAN DEFAULT FALSE,
  "image" TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Account table for OAuth providers
CREATE TABLE IF NOT EXISTS "account" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "accountId" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "accessToken" TEXT,
  "refreshToken" TEXT,
  "idToken" TEXT,
  "accessTokenExpiresAt" TIMESTAMP,
  "refreshTokenExpiresAt" TIMESTAMP,
  "scope" TEXT,
  "password" TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("accountId", "providerId")
);

-- Session table
CREATE TABLE IF NOT EXISTS "session" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "expiresAt" TIMESTAMP NOT NULL,
  "token" TEXT UNIQUE NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "deviceName" TEXT,
  "deviceType" TEXT,
  "isActive" BOOLEAN DEFAULT TRUE
);

-- Verification table for email verification
CREATE TABLE IF NOT EXISTS "verification" (
  "id" TEXT PRIMARY KEY,
  "identifier" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "expiresAt" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Two Factor Authentication tables
CREATE TABLE IF NOT EXISTS "twoFactor" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "secret" TEXT NOT NULL,
  "backupCodes" TEXT[],
  "isEnabled" BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Two Factor Backup Codes table
CREATE TABLE IF NOT EXISTS "twoFactorBackupCodes" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "code" TEXT NOT NULL,
  "isUsed" BOOLEAN DEFAULT FALSE,
  "usedAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Passkey/WebAuthn tables
CREATE TABLE IF NOT EXISTS "passkey" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "publicKey" TEXT NOT NULL,
  "webauthnUserID" TEXT NOT NULL,
  "counter" INTEGER DEFAULT 0,
  "deviceType" TEXT,
  "backedUp" BOOLEAN DEFAULT FALSE,
  "transports" TEXT[],
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email OTP table
CREATE TABLE IF NOT EXISTS "emailOTP" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL,
  "otp" TEXT NOT NULL,
  "expiresAt" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rate limiting table
CREATE TABLE IF NOT EXISTS "rateLimit" (
  "id" TEXT PRIMARY KEY,
  "identifier" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "count" INTEGER DEFAULT 1,
  "expiresAt" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Device approvals table
CREATE TABLE IF NOT EXISTS "deviceApproval" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "deviceFingerprint" TEXT NOT NULL,
  "deviceName" TEXT,
  "deviceType" TEXT,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "isApproved" BOOLEAN DEFAULT FALSE,
  "approvedAt" TIMESTAMP,
  "expiresAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_user_email" ON "user"("email");
CREATE INDEX IF NOT EXISTS "idx_account_userId" ON "account"("userId");
CREATE INDEX IF NOT EXISTS "idx_account_providerId" ON "account"("providerId");
CREATE INDEX IF NOT EXISTS "idx_session_userId" ON "session"("userId");
CREATE INDEX IF NOT EXISTS "idx_session_token" ON "session"("token");
CREATE INDEX IF NOT EXISTS "idx_session_expiresAt" ON "session"("expiresAt");
CREATE INDEX IF NOT EXISTS "idx_verification_identifier" ON "verification"("identifier");
CREATE INDEX IF NOT EXISTS "idx_verification_expiresAt" ON "verification"("expiresAt");
CREATE INDEX IF NOT EXISTS "idx_twoFactor_userId" ON "twoFactor"("userId");
CREATE INDEX IF NOT EXISTS "idx_twoFactorBackupCodes_userId" ON "twoFactorBackupCodes"("userId");
CREATE INDEX IF NOT EXISTS "idx_passkey_userId" ON "passkey"("userId");
CREATE INDEX IF NOT EXISTS "idx_emailOTP_email" ON "emailOTP"("email");
CREATE INDEX IF NOT EXISTS "idx_emailOTP_expiresAt" ON "emailOTP"("expiresAt");
CREATE INDEX IF NOT EXISTS "idx_rateLimit_identifier" ON "rateLimit"("identifier");
CREATE INDEX IF NOT EXISTS "idx_rateLimit_expiresAt" ON "rateLimit"("expiresAt");
CREATE INDEX IF NOT EXISTS "idx_deviceApproval_userId" ON "deviceApproval"("userId");
CREATE INDEX IF NOT EXISTS "idx_deviceApproval_fingerprint" ON "deviceApproval"("deviceFingerprint");
