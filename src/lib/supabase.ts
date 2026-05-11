import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UserProfile {
  id: string;
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
