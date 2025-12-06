CREATE TABLE "admin_actions" (
	"id" serial PRIMARY KEY NOT NULL,
	"admin_user_id" integer NOT NULL,
	"action" text NOT NULL,
	"target_user_id" integer,
	"details" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "agent_instructions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"agent_id" text NOT NULL,
	"instruction" text NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "board_reports" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"date" text,
	"ceo_score" integer,
	"executive_summary" text,
	"consensus" text,
	"grades" jsonb,
	"generated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "business_context" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"company_name" text,
	"founder_name" text,
	"industry" text,
	"description" text,
	"brand_dna" jsonb,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"source_title" text,
	"twitter_thread" text[],
	"linkedin_post" text,
	"tiktok_script" text,
	"newsletter_section" text,
	"generated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chat_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"agent_id" text NOT NULL,
	"role" text NOT NULL,
	"text" text NOT NULL,
	"timestamp" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "code_snippets" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" text,
	"language" text,
	"code" text,
	"explanation" text,
	"generated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "competitor_reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"competitor_name" text NOT NULL,
	"threat_level" text,
	"data" jsonb,
	"generated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"company" text,
	"role" text,
	"notes" text,
	"linkedin_url" text,
	"tags" text[],
	"last_contact" timestamp,
	"relationship" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "creative_assets" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"type" text NOT NULL,
	"title" text,
	"content" text,
	"prompt" text,
	"style" text,
	"generated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "daily_intelligence" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"date" text NOT NULL,
	"priority_actions" jsonb,
	"alerts" jsonb,
	"insights" jsonb,
	"motivational_message" text,
	"generated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "interview_guides" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"role_title" text NOT NULL,
	"questions" jsonb NOT NULL,
	"generated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "job_descriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"role_title" text NOT NULL,
	"hook" text,
	"responsibilities" text[],
	"requirements" text[],
	"perks" text[],
	"generated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "launch_strategies" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"product_name" text NOT NULL,
	"launch_date" text,
	"phases" jsonb,
	"generated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "legal_docs" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" text NOT NULL,
	"type" text NOT NULL,
	"content" text NOT NULL,
	"generated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notification_preferences" (
	"user_id" integer PRIMARY KEY NOT NULL,
	"email_enabled" boolean DEFAULT true,
	"sms_enabled" boolean DEFAULT false,
	"in_app_enabled" boolean DEFAULT true,
	"task_deadlines" boolean DEFAULT true,
	"financial_alerts" boolean DEFAULT true,
	"competitor_alerts" boolean DEFAULT true,
	"daily_digest" boolean DEFAULT true,
	"digest_time" text DEFAULT '08:00',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pitch_decks" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" text NOT NULL,
	"slides" jsonb NOT NULL,
	"generated_at" timestamp NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pivot_analyses" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"current_industry" text,
	"gaps" jsonb,
	"generated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "product_specs" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"feature_name" text NOT NULL,
	"summary" text,
	"features" jsonb,
	"data_model" text[],
	"generated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "search_index" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"tags" text[],
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "simulations" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"query" text NOT NULL,
	"likely_case" jsonb,
	"best_case" jsonb,
	"worst_case" jsonb,
	"strategic_advice" text,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sops" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"task_name" text NOT NULL,
	"goal" text,
	"steps" jsonb NOT NULL,
	"definition_of_done" text[],
	"generated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"stripe_price_id" text,
	"tier" text NOT NULL,
	"status" text NOT NULL,
	"current_period_start" timestamp,
	"current_period_end" timestamp,
	"cancel_at_period_end" boolean DEFAULT false,
	"trial_ends_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "subscriptions_stripe_customer_id_unique" UNIQUE("stripe_customer_id"),
	CONSTRAINT "subscriptions_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id")
);
--> statement-breakpoint
CREATE TABLE "training_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"scenario_title" text,
	"score" integer,
	"strengths" text[],
	"weaknesses" text[],
	"pro_tip" text,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tribe_blueprints" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"manifesto" jsonb,
	"rituals" jsonb,
	"engagement_loops" text[],
	"generated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "usage_tracking" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"month" text NOT NULL,
	"ai_generations" integer DEFAULT 0,
	"competitors_tracked" integer DEFAULT 0,
	"business_profiles" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "war_room_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"topic" text NOT NULL,
	"dialogue" jsonb NOT NULL,
	"consensus" text,
	"action_plan" text[],
	"timestamp" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "achievements" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "analytics_events" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "briefcases" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "calendar_connections" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "chat_conversations" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "chat_messages" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "collaboration_sessions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "competitive_opportunities" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "competitor_activities" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "competitor_alerts" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "competitor_profiles" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "competitors" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "custom_workflows" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "device_approvals" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "document_activity" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "document_folders" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "document_permissions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "document_share_links" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "document_versions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "documents" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "fine_tuning_jobs" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "focus_sessions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "goals" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "intelligence_data" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "learning_modules" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "notification_jobs" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "opportunity_actions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "opportunity_metrics" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "password_reset_tokens" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "posts" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "productivity_insights" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "push_subscriptions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "quiz_scores" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "scraping_job_results" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "scraping_jobs" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "session_checkpoints" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "session_messages" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "skill_assessments" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "task_analytics" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "task_categories" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "template_downloads" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "template_favorites" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "templates" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_achievements" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_api_keys" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_brand_settings" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_competitive_stats" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_learning_progress" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_mfa_settings" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_progress" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_sessions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "workflow_executions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "workflow_templates" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "workflows" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "achievements" CASCADE;--> statement-breakpoint
DROP TABLE "analytics_events" CASCADE;--> statement-breakpoint
DROP TABLE "briefcases" CASCADE;--> statement-breakpoint
DROP TABLE "calendar_connections" CASCADE;--> statement-breakpoint
DROP TABLE "chat_conversations" CASCADE;--> statement-breakpoint
DROP TABLE "chat_messages" CASCADE;--> statement-breakpoint
DROP TABLE "collaboration_sessions" CASCADE;--> statement-breakpoint
DROP TABLE "competitive_opportunities" CASCADE;--> statement-breakpoint
DROP TABLE "competitor_activities" CASCADE;--> statement-breakpoint
DROP TABLE "competitor_alerts" CASCADE;--> statement-breakpoint
DROP TABLE "competitor_profiles" CASCADE;--> statement-breakpoint
DROP TABLE "competitors" CASCADE;--> statement-breakpoint
DROP TABLE "custom_workflows" CASCADE;--> statement-breakpoint
DROP TABLE "device_approvals" CASCADE;--> statement-breakpoint
DROP TABLE "document_activity" CASCADE;--> statement-breakpoint
DROP TABLE "document_folders" CASCADE;--> statement-breakpoint
DROP TABLE "document_permissions" CASCADE;--> statement-breakpoint
DROP TABLE "document_share_links" CASCADE;--> statement-breakpoint
DROP TABLE "document_versions" CASCADE;--> statement-breakpoint
DROP TABLE "documents" CASCADE;--> statement-breakpoint
DROP TABLE "fine_tuning_jobs" CASCADE;--> statement-breakpoint
DROP TABLE "focus_sessions" CASCADE;--> statement-breakpoint
DROP TABLE "goals" CASCADE;--> statement-breakpoint
DROP TABLE "intelligence_data" CASCADE;--> statement-breakpoint
DROP TABLE "learning_modules" CASCADE;--> statement-breakpoint
DROP TABLE "notification_jobs" CASCADE;--> statement-breakpoint
DROP TABLE "opportunity_actions" CASCADE;--> statement-breakpoint
DROP TABLE "opportunity_metrics" CASCADE;--> statement-breakpoint
DROP TABLE "password_reset_tokens" CASCADE;--> statement-breakpoint
DROP TABLE "posts" CASCADE;--> statement-breakpoint
DROP TABLE "productivity_insights" CASCADE;--> statement-breakpoint
DROP TABLE "push_subscriptions" CASCADE;--> statement-breakpoint
DROP TABLE "quiz_scores" CASCADE;--> statement-breakpoint
DROP TABLE "scraping_job_results" CASCADE;--> statement-breakpoint
DROP TABLE "scraping_jobs" CASCADE;--> statement-breakpoint
DROP TABLE "session_checkpoints" CASCADE;--> statement-breakpoint
DROP TABLE "session_messages" CASCADE;--> statement-breakpoint
DROP TABLE "skill_assessments" CASCADE;--> statement-breakpoint
DROP TABLE "task_analytics" CASCADE;--> statement-breakpoint
DROP TABLE "task_categories" CASCADE;--> statement-breakpoint
DROP TABLE "template_downloads" CASCADE;--> statement-breakpoint
DROP TABLE "template_favorites" CASCADE;--> statement-breakpoint
DROP TABLE "templates" CASCADE;--> statement-breakpoint
DROP TABLE "user_achievements" CASCADE;--> statement-breakpoint
DROP TABLE "user_api_keys" CASCADE;--> statement-breakpoint
DROP TABLE "user_brand_settings" CASCADE;--> statement-breakpoint
DROP TABLE "user_competitive_stats" CASCADE;--> statement-breakpoint
DROP TABLE "user_learning_progress" CASCADE;--> statement-breakpoint
DROP TABLE "user_mfa_settings" CASCADE;--> statement-breakpoint
DROP TABLE "user_progress" CASCADE;--> statement-breakpoint
DROP TABLE "user_sessions" CASCADE;--> statement-breakpoint
DROP TABLE "workflow_executions" CASCADE;--> statement-breakpoint
DROP TABLE "workflow_templates" CASCADE;--> statement-breakpoint
DROP TABLE "workflows" CASCADE;--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_username_unique";--> statement-breakpoint
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_goal_id_goals_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_briefcase_id_briefcases_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_parent_task_id_tasks_id_fk";
--> statement-breakpoint
DROP INDEX "notifications_user_id_idx";--> statement-breakpoint
DROP INDEX "notifications_type_idx";--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "user_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "title" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "message" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "sent_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "title" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "status" SET DEFAULT 'todo';--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "priority" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "priority" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "priority" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "category" text NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "priority" text NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "read" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "action_url" text;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "assignee" text NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "estimated_time" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "stack_user_id" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" text DEFAULT 'user';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "admin_pin_hash" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "xp" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "level" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "total_actions" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "suspended" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "suspended_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "suspended_reason" text;--> statement-breakpoint
ALTER TABLE "admin_actions" ADD CONSTRAINT "admin_actions_admin_user_id_users_id_fk" FOREIGN KEY ("admin_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_instructions" ADD CONSTRAINT "agent_instructions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "board_reports" ADD CONSTRAINT "board_reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "code_snippets" ADD CONSTRAINT "code_snippets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creative_assets" ADD CONSTRAINT "creative_assets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_intelligence" ADD CONSTRAINT "daily_intelligence_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interview_guides" ADD CONSTRAINT "interview_guides_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_descriptions" ADD CONSTRAINT "job_descriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "launch_strategies" ADD CONSTRAINT "launch_strategies_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legal_docs" ADD CONSTRAINT "legal_docs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pitch_decks" ADD CONSTRAINT "pitch_decks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pivot_analyses" ADD CONSTRAINT "pivot_analyses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_specs" ADD CONSTRAINT "product_specs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulations" ADD CONSTRAINT "simulations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sops" ADD CONSTRAINT "sops_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_history" ADD CONSTRAINT "training_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tribe_blueprints" ADD CONSTRAINT "tribe_blueprints_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage_tracking" ADD CONSTRAINT "usage_tracking_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "war_room_sessions" ADD CONSTRAINT "war_room_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" DROP COLUMN "metadata";--> statement-breakpoint
ALTER TABLE "notifications" DROP COLUMN "status";--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN "goal_id";--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN "briefcase_id";--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN "parent_task_id";--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN "category";--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN "tags";--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN "due_date";--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN "estimated_minutes";--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN "actual_minutes";--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN "energy_level";--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN "is_recurring";--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN "recurrence_pattern";--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN "ai_suggestions";--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "password_hash";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "full_name";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "username";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "date_of_birth";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "avatar_url";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "subscription_tier";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "subscription_status";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "stripe_customer_id";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "stripe_subscription_id";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "current_period_start";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "current_period_end";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "cancel_at_period_end";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "is_verified";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "onboarding_completed";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "onboarding_completed_at";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "onboarding_data";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_stack_user_id_unique" UNIQUE("stack_user_id");