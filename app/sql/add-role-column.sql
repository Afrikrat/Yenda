-- Add role column to profiles if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user';
  END IF;
END $$;

-- Update existing admin users (assuming admin@example.com is your admin)
UPDATE profiles 
SET role = 'admin' 
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'admin@example.com'
);

-- Make sure all other users have the 'user' role
UPDATE profiles
SET role = 'user'
WHERE role IS NULL;
