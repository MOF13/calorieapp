-- Migration: V2 Schema Expansion
-- Author: Antigravity AI
-- Date: 2026-05-07

-- 1. Custom Foods Database (Arabic/UAE Focus)
CREATE TABLE IF NOT EXISTS custom_foods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_ar text,
  brand text,
  category text, -- 'emirati', 'arabic', 'fast_food', 'supermarket', etc.
  calories_per_100g numeric DEFAULT 0,
  protein_per_100g numeric DEFAULT 0,
  carbs_per_100g numeric DEFAULT 0,
  fat_per_100g numeric DEFAULT 0,
  fiber_per_100g numeric DEFAULT 0,
  sodium_per_100g numeric DEFAULT 0,
  common_serving_size_g numeric,
  common_serving_name text, -- '1 piece', '1 wrap', '1 cup'
  barcode text UNIQUE,
  is_verified boolean DEFAULT false,
  created_by uuid REFERENCES auth.users,
  created_at timestamptz DEFAULT now()
);

-- 2. Fasting Sessions
CREATE TABLE IF NOT EXISTS fasting_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  protocol text NOT NULL, -- '16:8', '18:6', '20:4', '5:2', 'custom'
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  target_hours numeric NOT NULL,
  actual_hours numeric,
  completed boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- 3. Exercise Logs
CREATE TABLE IF NOT EXISTS exercise_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  exercise_type text NOT NULL,
  duration_minutes integer NOT NULL,
  calories_burned integer DEFAULT 0,
  intensity text, -- 'low', 'moderate', 'high'
  logged_at timestamptz DEFAULT now()
);

-- 4. Detailed Water Entries
CREATE TABLE IF NOT EXISTS water_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  daily_log_id uuid REFERENCES daily_logs ON DELETE CASCADE,
  amount_ml integer NOT NULL,
  logged_at timestamptz DEFAULT now()
);

-- 5. Recipes
CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_ar text,
  cuisine text, -- 'emirati', 'arabic', 'mediterranean', etc.
  prep_time_minutes integer,
  cook_time_minutes integer,
  servings integer,
  calories_per_serving integer,
  protein_g numeric,
  carbs_g numeric,
  fat_g numeric,
  difficulty text, -- 'easy', 'medium', 'hard'
  tags text[], -- ['high-protein', 'ramadan', 'low-carb']
  ingredients jsonb,
  instructions jsonb,
  image_url text,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 6. NutriChat History
CREATE TABLE IF NOT EXISTS nutrichat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  role text NOT NULL, -- 'user', 'assistant'
  content text NOT NULL,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- 7. Add columns to existing tables
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS target_weight_kg numeric;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS preferred_language text DEFAULT 'en'; -- 'en', 'ar'
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS timezone text DEFAULT 'Asia/Dubai';

-- Enable RLS for all new tables
ALTER TABLE custom_foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE fasting_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrichat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view verified custom foods" ON custom_foods
  FOR SELECT USING (is_verified = true OR auth.uid() = created_by);

CREATE POLICY "Users can create custom foods" ON custom_foods
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can manage their own fasting sessions" ON fasting_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own exercise logs" ON exercise_logs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own water entries" ON water_entries
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view recipes" ON recipes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage their own chat history" ON nutrichat_messages
  FOR ALL USING (auth.uid() = user_id);
