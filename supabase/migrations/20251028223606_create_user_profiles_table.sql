/*
  # Create User Profiles Table

  ## Summary
  Creates the user_profiles table to store user information and their calculated nutrition goals.

  ## New Tables
  
  ### `user_profiles`
  - `id` (uuid, primary key) - References auth.users, one-to-one relationship
  - `age` (integer) - User's age in years
  - `sex` (text) - User's biological sex ('male' or 'female')
  - `height_cm` (numeric) - User's height in centimeters
  - `weight_kg` (numeric) - User's weight in kilograms
  - `activity_level` (text) - Activity level (sedentary, lightly_active, moderately_active, very_active, extra_active)
  - `goal_type` (text) - Weight goal (lose_weight, maintain, gain_weight)
  - `goal_pace` (text, nullable) - Goal pace (0_5_lb_per_week, 1_lb_per_week, 2_lbs_per_week)
  - `daily_calories` (integer) - Calculated daily calorie goal
  - `daily_protein_g` (integer) - Calculated daily protein goal in grams
  - `daily_carbs_g` (integer) - Calculated daily carbs goal in grams
  - `daily_fat_g` (integer) - Calculated daily fat goal in grams
  - `created_at` (timestamptz) - Profile creation timestamp
  - `updated_at` (timestamptz) - Profile last update timestamp

  ## Security
  
  - Enable RLS on `user_profiles` table
  - Users can read their own profile
  - Users can insert their own profile (only once)
  - Users can update their own profile

  ## Notes
  
  - Each user can only have one profile (enforced by primary key on id)
  - All nutrition goals are pre-calculated and stored for quick access
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  age integer NOT NULL,
  sex text NOT NULL CHECK (sex IN ('male', 'female')),
  height_cm numeric NOT NULL CHECK (height_cm > 0),
  weight_kg numeric NOT NULL CHECK (weight_kg > 0),
  activity_level text NOT NULL CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active')),
  goal_type text NOT NULL CHECK (goal_type IN ('lose_weight', 'maintain', 'gain_weight')),
  goal_pace text CHECK (goal_pace IN ('0_5_lb_per_week', '1_lb_per_week', '2_lbs_per_week')),
  daily_calories integer NOT NULL CHECK (daily_calories > 0),
  daily_protein_g integer NOT NULL CHECK (daily_protein_g > 0),
  daily_carbs_g integer NOT NULL CHECK (daily_carbs_g > 0),
  daily_fat_g integer NOT NULL CHECK (daily_fat_g > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
