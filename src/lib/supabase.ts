import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Check your .env file or Vercel settings.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

export interface UserProfile {
  id: string;
  full_name?: string;
  age: number;
  sex: string;
  height_cm: number;
  weight_kg: number;
  target_weight_kg?: number;
  activity_level: string;
  goal_type: string;
  goal_pace?: string;
  daily_calories: number;
  daily_protein_g: number;
  daily_carbs_g: number;
  daily_fat_g: number;
  current_streak?: number;
  longest_streak?: number;
  last_log_date?: string;
  preferred_language?: string;
  timezone?: string;
  is_ramadan_mode?: boolean;
  created_at: string;
  updated_at: string;
}

export interface DailyLog {
  id: string;
  user_id: string;
  log_date: string;
  total_calories: number;
  total_protein_g: number;
  total_carbs_g: number;
  total_fat_g: number;
  water_ml?: number;
  water_goal_ml?: number;
  created_at: string;
  updated_at: string;
}

export interface Meal {
  id: string;
  user_id: string;
  daily_log_id: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  photo_url?: string;
  created_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  achievement_type: string;
  unlocked_at: string;
}

export interface WeightLog {
  id: string;
  user_id: string;
  weight_kg: number;
  logged_at: string;
  note?: string;
}

export interface MealTemplate {
  id: string;
  user_id: string;
  name: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  use_count: number;
  created_at: string;
}

export interface CustomFood {
  id: string;
  name_en: string;
  name_ar?: string;
  brand?: string;
  category?: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g?: number;
  sodium_per_100g?: number;
  common_serving_size_g?: number;
  common_serving_name?: string;
  barcode?: string;
  is_verified: boolean;
  created_by?: string;
  created_at: string;
}

export interface FastingSession {
  id: string;
  user_id: string;
  protocol: string;
  start_time: string;
  end_time?: string;
  target_hours: number;
  actual_hours?: number;
  completed: boolean;
  notes?: string;
  created_at: string;
}

export interface ExerciseLog {
  id: string;
  user_id: string;
  exercise_type: string;
  duration_minutes: number;
  calories_burned: number;
  intensity?: 'low' | 'moderate' | 'high';
  logged_at: string;
}

export interface Recipe {
  id: string;
  name_en: string;
  name_ar?: string;
  cuisine?: string;
  prep_time_minutes?: number;
  cook_time_minutes?: number;
  servings?: number;
  calories_per_serving: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  difficulty?: string;
  tags?: string[];
  ingredients?: any;
  instructions?: any;
  image_url?: string;
  is_featured: boolean;
  created_at: string;
}

export interface NutriChatMessage {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  metadata?: any;
  created_at: string;
}
