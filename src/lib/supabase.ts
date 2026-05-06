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
