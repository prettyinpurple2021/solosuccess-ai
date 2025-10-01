import { pgTable, text, timestamp, boolean, integer, varchar, jsonb } from 'drizzle-orm/pg-core'

// Better Auth Core Tables
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').unique().notNull(),
  emailVerified: boolean('emailVerified').default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').unique().notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  deviceName: text('deviceName'),
  deviceType: text('deviceType'),
  isActive: boolean('isActive').default(true),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

export const twoFactor = pgTable('twoFactor', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  secret: text('secret').notNull(),
  backupCodes: jsonb('backupCodes'),
  isEnabled: boolean('isEnabled').default(false),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

export const twoFactorBackupCodes = pgTable('twoFactorBackupCodes', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  code: text('code').notNull(),
  isUsed: boolean('isUsed').default(false),
  usedAt: timestamp('usedAt'),
  createdAt: timestamp('createdAt').defaultNow(),
})

export const passkey = pgTable('passkey', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  publicKey: text('publicKey').notNull(),
  webauthnUserID: text('webauthnUserID').notNull(),
  counter: integer('counter').default(0),
  deviceType: text('deviceType'),
  backedUp: boolean('backedUp').default(false),
  transports: jsonb('transports'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

export const emailOTP = pgTable('emailOTP', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  otp: text('otp').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
})

export const rateLimit = pgTable('rateLimit', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  action: text('action').notNull(),
  count: integer('count').default(1),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

export const deviceApproval = pgTable('deviceApproval', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  deviceFingerprint: text('deviceFingerprint').notNull(),
  deviceName: text('deviceName'),
  deviceType: text('deviceType'),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  isApproved: boolean('isApproved').default(false),
  approvedAt: timestamp('approvedAt'),
  expiresAt: timestamp('expiresAt'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// Export the schema object for Better Auth
export const authSchema = {
  user,
  account,
  session,
  verification,
  twoFactor,
  twoFactorBackupCodes,
  passkey,
  emailOTP,
  rateLimit,
  deviceApproval,
}
