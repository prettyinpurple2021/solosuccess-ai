-- Add Stripe fields to users table
ALTER TABLE users 
ADD COLUMN stripe_customer_id VARCHAR(255),
ADD COLUMN stripe_subscription_id VARCHAR(255),
ADD COLUMN current_period_start TIMESTAMP,
ADD COLUMN current_period_end TIMESTAMP,
ADD COLUMN cancel_at_period_end BOOLEAN DEFAULT FALSE;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS users_stripe_customer_id_idx ON users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS users_stripe_subscription_id_idx ON users(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS users_subscription_status_idx ON users(subscription_status);
CREATE INDEX IF NOT EXISTS users_subscription_tier_idx ON users(subscription_tier);

-- Update existing users to have default values for required fields
UPDATE users 
SET subscription_tier = 'launch', 
    subscription_status = 'active',
    cancel_at_period_end = FALSE
WHERE subscription_tier IS NULL OR subscription_status IS NULL;
