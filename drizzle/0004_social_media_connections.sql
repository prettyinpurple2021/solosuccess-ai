-- Create social_media_connections table for user OAuth tokens
CREATE TABLE IF NOT EXISTS "social_media_connections" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	"user_id" integer NOT NULL,
	"platform" varchar(50) NOT NULL,
	"access_token" text NOT NULL,
	"refresh_token" text,
	"expires_at" timestamp,
	"token_secret" text,
	"account_id" varchar(255),
	"account_handle" varchar(255),
	"account_email" varchar(255),
	"account_name" varchar(255),
	"scopes" text,
	"is_active" boolean DEFAULT true,
	"last_synced_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "social_media_connections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "social_media_connections_user_id_idx" ON "social_media_connections" ("user_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "social_media_connections_platform_idx" ON "social_media_connections" ("platform");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "social_media_connections_user_platform_idx" ON "social_media_connections" ("user_id", "platform");

