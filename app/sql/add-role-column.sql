-- Add role column to profiles table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user';
    
    -- Set all existing users to 'user' role by default
    UPDATE profiles SET role = 'user' WHERE role IS NULL;
    
    -- You can manually set admin role for specific users later
    -- Example: UPDATE profiles SET role = 'admin' WHERE id = 'your-admin-user-id';
  END IF;
END $$;
