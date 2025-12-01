CREATE TABLE "chat_conversations" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"agent_id" varchar(50) NOT NULL,
	"agent_name" varchar(100) NOT NULL,
	"last_message" text,
	"last_message_at" timestamp,
	"message_count" integer DEFAULT 0,
	"is_archived" boolean DEFAULT false,
	"metadata" jsonb DEFAULT '{}',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"conversation_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"role" varchar(20) NOT NULL,
	"content" text NOT NULL,
	"metadata" jsonb DEFAULT '{}',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "competitive_opportunities" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"competitor_id" uuid NOT NULL,
	"intelligence_id" uuid,
	"opportunity_type" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"confidence" numeric(3, 2) NOT NULL,
	"impact" varchar(20) NOT NULL,
	"effort" varchar(20) NOT NULL,
	"timing" varchar(20) NOT NULL,
	"priority_score" numeric(5, 2) NOT NULL,
	"evidence" jsonb DEFAULT '[]',
	"recommendations" jsonb DEFAULT '[]',
	"status" varchar(50) DEFAULT 'identified',
	"assigned_to" uuid,
	"implementation_notes" text,
	"roi_estimate" numeric(10, 2),
	"actual_roi" numeric(10, 2),
	"success_metrics" jsonb DEFAULT '{}',
	"tags" jsonb DEFAULT '[]',
	"is_archived" boolean DEFAULT false,
	"detected_at" timestamp DEFAULT now(),
	"started_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "competitor_activities" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "competitor_activities_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"competitor_id" integer NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"activity_type" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"source_url" varchar(1000),
	"source_type" varchar(50) NOT NULL,
	"importance" varchar(20) DEFAULT 'medium' NOT NULL,
	"confidence" numeric(3, 2) DEFAULT '0.00',
	"metadata" jsonb DEFAULT '{}',
	"tags" jsonb DEFAULT '[]',
	"detected_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "competitors" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "competitors_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"website" varchar(500),
	"description" text,
	"strengths" jsonb DEFAULT '[]',
	"weaknesses" jsonb DEFAULT '[]',
	"opportunities" jsonb DEFAULT '[]',
	"threats" jsonb DEFAULT '[]',
	"market_position" varchar(100),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "document_activity" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "document_activity_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"document_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"action" varchar(50) NOT NULL,
	"details" jsonb DEFAULT '{}',
	"ip_address" varchar(45),
	"user_agent" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "document_folders" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "document_folders_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" varchar(255) NOT NULL,
	"parent_id" integer,
	"name" varchar(255) NOT NULL,
	"description" text,
	"color" varchar(7) DEFAULT '#8B5CF6',
	"icon" varchar(50),
	"is_default" boolean DEFAULT false,
	"file_count" integer DEFAULT 0,
	"total_size" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "document_permissions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "document_permissions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"document_id" varchar(255) NOT NULL,
	"user_id" varchar(255),
	"email" varchar(255),
	"role" varchar(20) DEFAULT 'viewer' NOT NULL,
	"granted_by" varchar(255) NOT NULL,
	"granted_at" timestamp DEFAULT now(),
	"expires_at" timestamp,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "document_share_links" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"document_id" varchar(255) NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"url" varchar(1000) NOT NULL,
	"password_hash" varchar(255),
	"permissions" varchar(20) DEFAULT 'view' NOT NULL,
	"expires_at" timestamp,
	"max_access_count" integer,
	"access_count" integer DEFAULT 0,
	"download_enabled" boolean DEFAULT true,
	"require_auth" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "document_versions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "document_versions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"document_id" varchar(255) NOT NULL,
	"version_number" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"file_type" varchar(50) NOT NULL,
	"size" integer NOT NULL,
	"file_data" text NOT NULL,
	"change_summary" text,
	"created_by" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"folder_id" integer,
	"name" varchar(255) NOT NULL,
	"original_name" varchar(255) NOT NULL,
	"file_type" varchar(50) NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"size" integer NOT NULL,
	"file_url" varchar(1000),
	"category" varchar(100) DEFAULT 'uncategorized',
	"description" text,
	"tags" jsonb DEFAULT '[]',
	"metadata" jsonb DEFAULT '{}',
	"ai_insights" jsonb DEFAULT '{}',
	"is_favorite" boolean DEFAULT false,
	"is_public" boolean DEFAULT false,
	"download_count" integer DEFAULT 0,
	"view_count" integer DEFAULT 0,
	"last_accessed" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "opportunity_actions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "opportunity_actions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"opportunity_id" varchar(255) NOT NULL,
	"user_id" uuid NOT NULL,
	"action_type" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"priority" varchar(20) DEFAULT 'medium',
	"estimated_effort_hours" integer,
	"actual_effort_hours" integer,
	"estimated_cost" numeric(10, 2),
	"actual_cost" numeric(10, 2),
	"expected_outcome" text,
	"actual_outcome" text,
	"status" varchar(50) DEFAULT 'pending',
	"due_date" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "opportunity_metrics" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "opportunity_metrics_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"opportunity_id" varchar(255) NOT NULL,
	"user_id" uuid NOT NULL,
	"metric_name" varchar(100) NOT NULL,
	"metric_type" varchar(50) NOT NULL,
	"baseline_value" numeric(15, 4),
	"target_value" numeric(15, 4),
	"current_value" numeric(15, 4),
	"unit" varchar(50),
	"measurement_date" timestamp DEFAULT now(),
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "push_subscriptions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "push_subscriptions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" uuid NOT NULL,
	"endpoint" varchar(1000) NOT NULL,
	"p256dh_key" varchar(500) NOT NULL,
	"auth_key" varchar(500) NOT NULL,
	"device_info" jsonb DEFAULT '{}',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_brand_settings" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_brand_settings_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" uuid NOT NULL,
	"company_name" varchar(255),
	"tagline" varchar(500),
	"description" text,
	"industry" varchar(100),
	"target_audience" text,
	"brand_personality" jsonb DEFAULT '[]',
	"color_palette" jsonb DEFAULT '{}',
	"typography" jsonb DEFAULT '{}',
	"logo_url" varchar(1000),
	"logo_prompt" text,
	"moodboard" jsonb DEFAULT '[]',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_brand_settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "user_competitive_stats" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_competitive_stats_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" varchar(255) NOT NULL,
	"competitors_monitored" integer DEFAULT 0,
	"intelligence_gathered" integer DEFAULT 0,
	"alerts_processed" integer DEFAULT 0,
	"opportunities_identified" integer DEFAULT 0,
	"competitive_tasks_completed" integer DEFAULT 0,
	"market_victories" integer DEFAULT 0,
	"threat_responses" integer DEFAULT 0,
	"intelligence_streaks" integer DEFAULT 0,
	"competitive_advantage_points" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "stripe_customer_id" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "stripe_subscription_id" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "current_period_start" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "current_period_end" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "cancel_at_period_end" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "onboarding_completed" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "onboarding_completed_at" timestamp;--> statement-breakpoint
ALTER TABLE "chat_conversations" ADD CONSTRAINT "chat_conversations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_conversation_id_chat_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."chat_conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competitive_opportunities" ADD CONSTRAINT "competitive_opportunities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competitive_opportunities" ADD CONSTRAINT "competitive_opportunities_competitor_id_competitor_profiles_id_fk" FOREIGN KEY ("competitor_id") REFERENCES "public"."competitor_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competitive_opportunities" ADD CONSTRAINT "competitive_opportunities_intelligence_id_intelligence_data_id_fk" FOREIGN KEY ("intelligence_id") REFERENCES "public"."intelligence_data"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competitive_opportunities" ADD CONSTRAINT "competitive_opportunities_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competitor_activities" ADD CONSTRAINT "competitor_activities_competitor_id_competitor_profiles_id_fk" FOREIGN KEY ("competitor_id") REFERENCES "public"."competitor_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competitor_activities" ADD CONSTRAINT "competitor_activities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competitors" ADD CONSTRAINT "competitors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_activity" ADD CONSTRAINT "document_activity_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_activity" ADD CONSTRAINT "document_activity_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_folders" ADD CONSTRAINT "document_folders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_folders" ADD CONSTRAINT "document_folders_parent_id_document_folders_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."document_folders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_permissions" ADD CONSTRAINT "document_permissions_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_permissions" ADD CONSTRAINT "document_permissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_permissions" ADD CONSTRAINT "document_permissions_granted_by_users_id_fk" FOREIGN KEY ("granted_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_share_links" ADD CONSTRAINT "document_share_links_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_share_links" ADD CONSTRAINT "document_share_links_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_versions" ADD CONSTRAINT "document_versions_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_versions" ADD CONSTRAINT "document_versions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_folder_id_document_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."document_folders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunity_actions" ADD CONSTRAINT "opportunity_actions_opportunity_id_competitive_opportunities_id_fk" FOREIGN KEY ("opportunity_id") REFERENCES "public"."competitive_opportunities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunity_actions" ADD CONSTRAINT "opportunity_actions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunity_metrics" ADD CONSTRAINT "opportunity_metrics_opportunity_id_competitive_opportunities_id_fk" FOREIGN KEY ("opportunity_id") REFERENCES "public"."competitive_opportunities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunity_metrics" ADD CONSTRAINT "opportunity_metrics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "push_subscriptions" ADD CONSTRAINT "push_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_brand_settings" ADD CONSTRAINT "user_brand_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_competitive_stats" ADD CONSTRAINT "user_competitive_stats_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chat_conversations_user_id_idx" ON "chat_conversations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "chat_conversations_agent_id_idx" ON "chat_conversations" USING btree ("agent_id");--> statement-breakpoint
CREATE INDEX "chat_conversations_last_message_at_idx" ON "chat_conversations" USING btree ("last_message_at");--> statement-breakpoint
CREATE INDEX "chat_conversations_is_archived_idx" ON "chat_conversations" USING btree ("is_archived");--> statement-breakpoint
CREATE INDEX "chat_messages_conversation_id_idx" ON "chat_messages" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "chat_messages_user_id_idx" ON "chat_messages" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "chat_messages_role_idx" ON "chat_messages" USING btree ("role");--> statement-breakpoint
CREATE INDEX "chat_messages_created_at_idx" ON "chat_messages" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "competitive_opportunities_user_id_idx" ON "competitive_opportunities" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "competitive_opportunities_competitor_id_idx" ON "competitive_opportunities" USING btree ("competitor_id");--> statement-breakpoint
CREATE INDEX "competitive_opportunities_type_idx" ON "competitive_opportunities" USING btree ("opportunity_type");--> statement-breakpoint
CREATE INDEX "competitive_opportunities_impact_idx" ON "competitive_opportunities" USING btree ("impact");--> statement-breakpoint
CREATE INDEX "competitive_opportunities_status_idx" ON "competitive_opportunities" USING btree ("status");--> statement-breakpoint
CREATE INDEX "competitive_opportunities_priority_score_idx" ON "competitive_opportunities" USING btree ("priority_score");--> statement-breakpoint
CREATE INDEX "competitive_opportunities_detected_at_idx" ON "competitive_opportunities" USING btree ("detected_at");--> statement-breakpoint
CREATE INDEX "competitive_opportunities_is_archived_idx" ON "competitive_opportunities" USING btree ("is_archived");--> statement-breakpoint
CREATE INDEX "competitor_activities_competitor_id_idx" ON "competitor_activities" USING btree ("competitor_id");--> statement-breakpoint
CREATE INDEX "competitor_activities_user_id_idx" ON "competitor_activities" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "competitor_activities_activity_type_idx" ON "competitor_activities" USING btree ("activity_type");--> statement-breakpoint
CREATE INDEX "competitor_activities_importance_idx" ON "competitor_activities" USING btree ("importance");--> statement-breakpoint
CREATE INDEX "competitor_activities_detected_at_idx" ON "competitor_activities" USING btree ("detected_at");--> statement-breakpoint
CREATE INDEX "document_activity_document_id_idx" ON "document_activity" USING btree ("document_id");--> statement-breakpoint
CREATE INDEX "document_activity_user_id_idx" ON "document_activity" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "document_activity_action_idx" ON "document_activity" USING btree ("action");--> statement-breakpoint
CREATE INDEX "document_activity_created_at_idx" ON "document_activity" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "document_folders_user_id_idx" ON "document_folders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "document_folders_parent_id_idx" ON "document_folders" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "document_folders_name_idx" ON "document_folders" USING btree ("name");--> statement-breakpoint
CREATE INDEX "document_permissions_document_id_idx" ON "document_permissions" USING btree ("document_id");--> statement-breakpoint
CREATE INDEX "document_permissions_user_id_idx" ON "document_permissions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "document_permissions_email_idx" ON "document_permissions" USING btree ("email");--> statement-breakpoint
CREATE INDEX "document_permissions_role_idx" ON "document_permissions" USING btree ("role");--> statement-breakpoint
CREATE INDEX "document_share_links_document_id_idx" ON "document_share_links" USING btree ("document_id");--> statement-breakpoint
CREATE INDEX "document_share_links_created_by_idx" ON "document_share_links" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "document_share_links_is_active_idx" ON "document_share_links" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "document_share_links_expires_at_idx" ON "document_share_links" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "document_versions_document_id_idx" ON "document_versions" USING btree ("document_id");--> statement-breakpoint
CREATE INDEX "document_versions_version_number_idx" ON "document_versions" USING btree ("version_number");--> statement-breakpoint
CREATE INDEX "document_versions_created_by_idx" ON "document_versions" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "documents_user_id_idx" ON "documents" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "documents_folder_id_idx" ON "documents" USING btree ("folder_id");--> statement-breakpoint
CREATE INDEX "documents_category_idx" ON "documents" USING btree ("category");--> statement-breakpoint
CREATE INDEX "documents_file_type_idx" ON "documents" USING btree ("file_type");--> statement-breakpoint
CREATE INDEX "documents_is_favorite_idx" ON "documents" USING btree ("is_favorite");--> statement-breakpoint
CREATE INDEX "documents_created_at_idx" ON "documents" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "documents_name_idx" ON "documents" USING btree ("name");--> statement-breakpoint
CREATE INDEX "opportunity_actions_opportunity_id_idx" ON "opportunity_actions" USING btree ("opportunity_id");--> statement-breakpoint
CREATE INDEX "opportunity_actions_user_id_idx" ON "opportunity_actions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "opportunity_actions_status_idx" ON "opportunity_actions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "opportunity_actions_priority_idx" ON "opportunity_actions" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "opportunity_actions_due_date_idx" ON "opportunity_actions" USING btree ("due_date");--> statement-breakpoint
CREATE INDEX "opportunity_metrics_opportunity_id_idx" ON "opportunity_metrics" USING btree ("opportunity_id");--> statement-breakpoint
CREATE INDEX "opportunity_metrics_user_id_idx" ON "opportunity_metrics" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "opportunity_metrics_metric_name_idx" ON "opportunity_metrics" USING btree ("metric_name");--> statement-breakpoint
CREATE INDEX "opportunity_metrics_measurement_date_idx" ON "opportunity_metrics" USING btree ("measurement_date");--> statement-breakpoint
CREATE INDEX "push_subscriptions_user_id_idx" ON "push_subscriptions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "push_subscriptions_endpoint_idx" ON "push_subscriptions" USING btree ("endpoint");--> statement-breakpoint
CREATE INDEX "push_subscriptions_is_active_idx" ON "push_subscriptions" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "user_brand_settings_user_id_idx" ON "user_brand_settings" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_brand_settings_industry_idx" ON "user_brand_settings" USING btree ("industry");