-- Add is_premium column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN NOT NULL DEFAULT false;

-- Create a function to check if user can add more cows
CREATE OR REPLACE FUNCTION public.can_add_cow(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    CASE 
      WHEN (SELECT is_premium FROM profiles WHERE id = user_uuid) = true THEN true
      WHEN (SELECT COUNT(*) FROM cows WHERE user_id = user_uuid) < 5 THEN true
      ELSE false
    END;
$$;