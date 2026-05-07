-- ==========================================
-- CALORIETRACKER V2 CONSOLIDATED SCHEMA
-- ==========================================

-- 1. EXTEND USER PROFILES
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS target_weight_kg numeric;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS preferred_language text DEFAULT 'en';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS timezone text DEFAULT 'Asia/Dubai';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS is_ramadan_mode boolean DEFAULT false;

-- 2. CUSTOM FOODS (ARABIC DATABASE)
CREATE TABLE IF NOT EXISTS custom_foods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_ar text,
  brand text,
  category text,
  calories_per_100g numeric DEFAULT 0,
  protein_per_100g numeric DEFAULT 0,
  carbs_per_100g numeric DEFAULT 0,
  fat_per_100g numeric DEFAULT 0,
  fiber_per_100g numeric DEFAULT 0,
  sodium_per_100g numeric DEFAULT 0,
  common_serving_size_g numeric,
  common_serving_name text,
  barcode text UNIQUE,
  is_verified boolean DEFAULT false,
  created_by uuid REFERENCES auth.users,
  created_at timestamptz DEFAULT now()
);

-- 3. FASTING SESSIONS
CREATE TABLE IF NOT EXISTS fasting_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  protocol text NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  target_hours numeric NOT NULL,
  actual_hours numeric,
  completed boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- 4. EXERCISE LOGS
CREATE TABLE IF NOT EXISTS exercise_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  exercise_type text NOT NULL,
  duration_minutes integer NOT NULL,
  calories_burned integer DEFAULT 0,
  intensity text,
  logged_at timestamptz DEFAULT now()
);

-- 5. NUTRICHAT HISTORY
CREATE TABLE IF NOT EXISTS nutrichat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  role text NOT NULL,
  content text NOT NULL,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- 6. RECIPES
CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_ar text,
  cuisine text,
  prep_time_minutes integer,
  cook_time_minutes integer,
  servings integer,
  calories_per_serving integer,
  protein_g numeric,
  carbs_g numeric,
  fat_g numeric,
  difficulty text,
  tags text[],
  ingredients jsonb,
  instructions jsonb,
  image_url text,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

ALTER TABLE custom_foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE fasting_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrichat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- POLICIES
CREATE POLICY "Anyone can view verified foods" ON custom_foods FOR SELECT USING (is_verified = true OR auth.uid() = created_by);
CREATE POLICY "Users can create foods" ON custom_foods FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can manage their fasting" ON fasting_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their exercise" ON exercise_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their chat" ON nutrichat_messages FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view recipes" ON recipes FOR SELECT TO authenticated USING (true);

-- ==========================================
-- SEED DATA (ARABIC/UAE FAVORITES)
-- ==========================================

INSERT INTO custom_foods (name_en, name_ar, category, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, is_verified)
VALUES 
('Chicken Machboos', 'مجبوس دجاج', 'emirati', 165, 12, 18, 5, true),
('Harees', 'هريس', 'emirati', 110, 7, 15, 3, true),
('Luqaimat', 'لقيمات', 'emirati', 310, 4, 55, 9, true),
('Arabic Coffee (Gahwa)', 'قهوة عربية', 'arabic', 2, 0, 0, 0, true),
('Khalas Dates', 'تمر خلاص', 'arabic', 282, 2, 75, 0, true),
('Chicken Shawarma Wrap', 'شاورما دجاج', 'arabic', 230, 14, 22, 10, true),
('Hummus', 'حمص', 'arabic', 166, 8, 14, 10, true),
('Lentil Soup', 'شوربة عدس', 'arabic', 85, 5, 14, 2, true)
ON CONFLICT (barcode) DO NOTHING;
