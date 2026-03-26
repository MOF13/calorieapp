/*
  # Create Daily Logs and Meals Tables

  ## Summary
  Creates tables to store daily nutrition logs and individual meals/food entries.

  ## New Tables
  
  ### `daily_logs`
  - `id` (uuid, primary key) - Unique identifier for each daily log
  - `user_id` (uuid) - References auth.users
  - `log_date` (date) - The date for this log entry
  - `total_calories` (integer) - Total calories consumed for the day
  - `total_protein_g` (integer) - Total protein consumed in grams
  - `total_carbs_g` (integer) - Total carbs consumed in grams
  - `total_fat_g` (integer) - Total fat consumed in grams
  - `created_at` (timestamptz) - Log creation timestamp
  - `updated_at` (timestamptz) - Log last update timestamp
  - Unique constraint on (user_id, log_date) - One log per user per day

  ### `meals`
  - `id` (uuid, primary key) - Unique identifier for each meal
  - `user_id` (uuid) - References auth.users
  - `daily_log_id` (uuid) - References daily_logs
  - `meal_type` (text) - Type of meal (breakfast, lunch, dinner, snacks)
  - `name` (text) - Name of the food/meal
  - `calories` (integer) - Calories in this meal
  - `protein_g` (integer) - Protein in grams
  - `carbs_g` (integer) - Carbs in grams
  - `fat_g` (integer) - Fat in grams
  - `photo_url` (text, nullable) - URL to photo of the meal
  - `created_at` (timestamptz) - Meal creation timestamp

  ## Security
  
  - Enable RLS on both tables
  - Users can only access their own logs and meals
  - Policies for SELECT, INSERT, UPDATE, DELETE operations

  ## Notes
  
  - Daily logs aggregate data from individual meals
  - Meals are linked to daily logs for organization
  - All numeric values default to 0 to prevent null issues
*/

CREATE TABLE IF NOT EXISTS daily_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  log_date date NOT NULL,
  total_calories integer DEFAULT 0,
  total_protein_g integer DEFAULT 0,
  total_carbs_g integer DEFAULT 0,
  total_fat_g integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, log_date)
);

CREATE TABLE IF NOT EXISTS meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  daily_log_id uuid NOT NULL REFERENCES daily_logs ON DELETE CASCADE,
  meal_type text NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snacks')),
  name text NOT NULL,
  calories integer DEFAULT 0,
  protein_g integer DEFAULT 0,
  carbs_g integer DEFAULT 0,
  fat_g integer DEFAULT 0,
  photo_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own daily logs"
  ON daily_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily logs"
  ON daily_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily logs"
  ON daily_logs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own daily logs"
  ON daily_logs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read own meals"
  ON meals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meals"
  ON meals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meals"
  ON meals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own meals"
  ON meals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_daily_logs_user_date ON daily_logs(user_id, log_date);
CREATE INDEX IF NOT EXISTS idx_meals_daily_log ON meals(daily_log_id);
CREATE INDEX IF NOT EXISTS idx_meals_user_id ON meals(user_id);
