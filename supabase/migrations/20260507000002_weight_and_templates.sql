-- Migration: Weight logs and Meal templates
CREATE TABLE IF NOT EXISTS weight_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  weight_kg numeric NOT NULL,
  logged_at timestamptz DEFAULT now(),
  note text
);

ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own weight logs" ON weight_logs
  FOR ALL TO authenticated USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE TABLE IF NOT EXISTS meal_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  meal_type text NOT NULL CHECK (meal_type IN ('breakfast','lunch','dinner','snacks')),
  calories integer DEFAULT 0,
  protein_g integer DEFAULT 0,
  carbs_g integer DEFAULT 0,
  fat_g integer DEFAULT 0,
  use_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE meal_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own templates" ON meal_templates
  FOR ALL TO authenticated USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);
