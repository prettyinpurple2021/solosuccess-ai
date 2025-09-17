-- Migration: Add file storage and push subscriptions support
-- Description: Replace file_data with file_url for Vercel Blob storage and add push subscriptions table

-- Add file_url column to documents table (for Vercel Blob storage)
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS file_url VARCHAR(1000);

-- Create index for file_url
CREATE INDEX IF NOT EXISTS documents_file_url_idx ON documents(file_url);

-- Create user_brand_settings table
CREATE TABLE IF NOT EXISTS user_brand_settings (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(255),
  tagline VARCHAR(500),
  description TEXT,
  industry VARCHAR(100),
  target_audience TEXT,
  brand_personality JSONB DEFAULT '[]',
  color_palette JSONB DEFAULT '{}',
  typography JSONB DEFAULT '{}',
  logo_url VARCHAR(1000),
  logo_prompt TEXT,
  moodboard JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create indexes for user_brand_settings
CREATE INDEX IF NOT EXISTS user_brand_settings_user_id_idx ON user_brand_settings(user_id);
CREATE INDEX IF NOT EXISTS user_brand_settings_industry_idx ON user_brand_settings(industry);

-- Create push_subscriptions table
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint VARCHAR(1000) NOT NULL,
  p256dh_key VARCHAR(500) NOT NULL,
  auth_key VARCHAR(500) NOT NULL,
  device_info JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for push_subscriptions
CREATE INDEX IF NOT EXISTS push_subscriptions_user_id_idx ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS push_subscriptions_endpoint_idx ON push_subscriptions(endpoint);
CREATE INDEX IF NOT EXISTS push_subscriptions_is_active_idx ON push_subscriptions(is_active);

-- Note: After running this migration, you can optionally remove the file_data column
-- ALTER TABLE documents DROP COLUMN IF EXISTS file_data;
-- But only do this after migrating any existing files to Vercel Blob storage
