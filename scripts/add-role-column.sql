-- Safe migration to add role column to users table
-- This script only adds the role column without touching existing data

-- Check if role column already exists
DO $$ 
BEGIN
    -- Add role column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'role'
    ) THEN
        ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user';
        RAISE NOTICE 'Added role column to users table';
    ELSE
        RAISE NOTICE 'Role column already exists';
    END IF;
END $$;

-- Update existing users to have 'user' role (only if role is NULL)
UPDATE users SET role = 'user' WHERE role IS NULL;

-- Make role field not null (only if all users now have a role)
DO $$
BEGIN
    -- Check if all users have a role
    IF NOT EXISTS (SELECT 1 FROM users WHERE role IS NULL) THEN
        ALTER TABLE users ALTER COLUMN role SET NOT NULL;
        RAISE NOTICE 'Set role column as NOT NULL';
    ELSE
        RAISE NOTICE 'Some users still have NULL role - skipping NOT NULL constraint';
    END IF;
END $$;

-- Create index for role field (ignore if already exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'users' AND indexname = 'users_role_idx'
    ) THEN
        CREATE INDEX users_role_idx ON users(role);
        RAISE NOTICE 'Created index on role field';
    ELSE
        RAISE NOTICE 'Index on role field already exists';
    END IF;
END $$;
