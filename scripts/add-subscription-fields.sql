-- Add subscription-related columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'launchpad',
ADD COLUMN IF NOT EXISTS subscription_status TEXT,
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS subscription_current_period_start TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS subscription_current_period_end TIMESTAMPTZ;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier ON profiles(subscription_tier);

-- Create usage tracking table
CREATE TABLE IF NOT EXISTS user_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  month_year TEXT NOT NULL, -- Format: 'YYYY-MM'
  tasks_completed INTEGER DEFAULT 0,
  ai_interactions INTEGER DEFAULT 0,
  storage_used_gb DECIMAL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, month_year)
);

-- Create index for usage tracking
CREATE INDEX IF NOT EXISTS idx_user_usage_user_month ON user_usage(user_id, month_year);

-- Function to get or create current month usage
CREATE OR REPLACE FUNCTION get_or_create_monthly_usage(p_user_id UUID)
RETURNS user_usage AS $$
DECLARE
  current_month TEXT;
  usage_record user_usage;
BEGIN
  current_month := TO_CHAR(NOW(), 'YYYY-MM');
  
  SELECT * INTO usage_record
  FROM user_usage
  WHERE user_id = p_user_id AND month_year = current_month;
  
  IF NOT FOUND THEN
    INSERT INTO user_usage (user_id, month_year)
    VALUES (p_user_id, current_month)
    RETURNING * INTO usage_record;
  END IF;
  
  RETURN usage_record;
END;
$$ LANGUAGE plpgsql;

-- Function to increment task count
CREATE OR REPLACE FUNCTION increment_task_count(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_usage (user_id, month_year, tasks_completed)
  VALUES (p_user_id, TO_CHAR(NOW(), 'YYYY-MM'), 1)
  ON CONFLICT (user_id, month_year)
  DO UPDATE SET 
    tasks_completed = user_usage.tasks_completed + 1,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to increment AI interaction count
CREATE OR REPLACE FUNCTION increment_ai_interaction(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_usage (user_id, month_year, ai_interactions)
  VALUES (p_user_id, TO_CHAR(NOW(), 'YYYY-MM'), 1)
  ON CONFLICT (user_id, month_year)
  DO UPDATE SET 
    ai_interactions = user_usage.ai_interactions + 1,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to update storage usage
CREATE OR REPLACE FUNCTION update_storage_usage(p_user_id UUID, p_storage_gb DECIMAL)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_usage (user_id, month_year, storage_used_gb)
  VALUES (p_user_id, TO_CHAR(NOW(), 'YYYY-MM'), p_storage_gb)
  ON CONFLICT (user_id, month_year)
  DO UPDATE SET 
    storage_used_gb = p_storage_gb,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;
