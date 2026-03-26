/*
  # Optimize RLS Policies for Performance

  ## Summary
  Optimizes all RLS policies to prevent re-evaluation of auth.uid() for each row.
  This significantly improves query performance at scale by wrapping auth.uid() 
  calls in SELECT statements.

  ## Changes Made

  ### user_profiles Table
  - Replace `auth.uid()` with `(select auth.uid())` in all policies
  - Affects: read, insert, and update policies

  ### daily_logs Table
  - Replace `auth.uid()` with `(select auth.uid())` in all policies
  - Affects: read, insert, update, and delete policies

  ### meals Table
  - Replace `auth.uid()` with `(select auth.uid())` in all policies
  - Affects: read, insert, update, and delete policies

  ## Performance Impact
  - Prevents function re-evaluation for each row
  - Significantly reduces query execution time for large datasets
  - Maintains the same security guarantees

  ## Additional Changes
  - Remove unused index `idx_meals_user_id` on meals table
*/

-- Drop existing policies for user_profiles
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

-- Create optimized policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- Drop existing policies for daily_logs
DROP POLICY IF EXISTS "Users can read own daily logs" ON daily_logs;
DROP POLICY IF EXISTS "Users can insert own daily logs" ON daily_logs;
DROP POLICY IF EXISTS "Users can update own daily logs" ON daily_logs;
DROP POLICY IF EXISTS "Users can delete own daily logs" ON daily_logs;

-- Create optimized policies for daily_logs
CREATE POLICY "Users can read own daily logs"
  ON daily_logs FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own daily logs"
  ON daily_logs FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own daily logs"
  ON daily_logs FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own daily logs"
  ON daily_logs FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Drop existing policies for meals
DROP POLICY IF EXISTS "Users can read own meals" ON meals;
DROP POLICY IF EXISTS "Users can insert own meals" ON meals;
DROP POLICY IF EXISTS "Users can update own meals" ON meals;
DROP POLICY IF EXISTS "Users can delete own meals" ON meals;

-- Create optimized policies for meals
CREATE POLICY "Users can read own meals"
  ON meals FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own meals"
  ON meals FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own meals"
  ON meals FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own meals"
  ON meals FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Remove unused index
DROP INDEX IF EXISTS idx_meals_user_id;