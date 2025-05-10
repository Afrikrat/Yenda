-- Create user_preferences table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT false,
  sms_notifications BOOLEAN DEFAULT false,
  dark_mode BOOLEAN DEFAULT false,
  location_services BOOLEAN DEFAULT true,
  event_categories TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create comments table if it doesn't exist
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- Update existing admin users
UPDATE profiles SET role = 'admin' WHERE email = 'admin@example.com';
