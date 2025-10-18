-- Set user role to admin for prettyinpurple2021@gmail.com
UPDATE users 
SET role = 'admin', updated_at = NOW() 
WHERE email = 'prettyinpurple2021@gmail.com';

-- Verify the update
SELECT id, email, full_name, role, updated_at 
FROM users 
WHERE email = 'prettyinpurple2021@gmail.com';
