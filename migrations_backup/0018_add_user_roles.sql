-- Add role field to users table
ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user';

-- Update existing users to have 'user' role
UPDATE users SET role = 'user' WHERE role IS NULL;

-- Make role field not null after setting defaults
ALTER TABLE users ALTER COLUMN role SET NOT NULL;

-- Create index for role field for better query performance
CREATE INDEX users_role_idx ON users(role);
