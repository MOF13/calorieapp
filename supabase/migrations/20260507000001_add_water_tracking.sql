-- Migration: Add water tracking to daily_logs
ALTER TABLE daily_logs 
  ADD COLUMN IF NOT EXISTS water_ml integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS water_goal_ml integer DEFAULT 2500;
