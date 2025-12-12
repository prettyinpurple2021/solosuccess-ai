-- Add usage tracking table for daily limits
CREATE TABLE IF NOT EXISTS daily_usage_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  conversations_count INTEGER DEFAULT 0,
  agents_accessed TEXT[] DEFAULT '{}',
  file_storage_bytes BIGINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_daily_usage_user_date ON daily_usage_limits(user_id, date);

-- Function to automatically reset daily counts
CREATE OR REPLACE FUNCTION reset_daily_usage_counts()
RETURNS void AS $$
BEGIN
  -- Delete usage records older than 30 days
  DELETE FROM daily_usage_limits WHERE date < CURRENT_DATE - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Update users table to ensure all Stripe fields exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='stripe_customer_id') THEN
    ALTER TABLE users ADD COLUMN stripe_customer_id VARCHAR(255);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='stripe_subscription_id') THEN
    ALTER TABLE users ADD COLUMN stripe_subscription_id VARCHAR(255);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='current_period_start') THEN
    ALTER TABLE users ADD COLUMN current_period_start TIMESTAMP;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='current_period_end') THEN
    ALTER TABLE users ADD COLUMN current_period_end TIMESTAMP;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='cancel_at_period_end') THEN
    ALTER TABLE users ADD COLUMN cancel_at_period_end BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

