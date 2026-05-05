/*
  # Fix daily_logs RLS INSERT policy

  The INSERT policy for daily_logs needs to properly allow authenticated users
  to create daily logs for themselves. This migration ensures the policy is
  correctly configured to check that the user_id matches auth.uid().

  Changes:
  - Drop existing INSERT policy if it doesn't work correctly
  - Recreate with proper WITH CHECK clause
  - Ensure policy applies to authenticated role
*/

DO $$
BEGIN
  -- Drop existing policy to recreate it
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'daily_logs' 
    AND policyname = 'Users can insert own daily logs'
  ) THEN
    DROP POLICY "Users can insert own daily logs" ON daily_logs;
  END IF;
  
  -- Create new INSERT policy with explicit user_id check
  CREATE POLICY "Users can insert own daily logs"
    ON daily_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
    
END $$;
