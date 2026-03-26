import { supabase, UserProfile, DailyLog, Meal } from './supabase';

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
}

export async function createUserProfile(profile: Omit<UserProfile, 'created_at' | 'updated_at'>): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert(profile)
    .select()
    .single();

  if (error) {
    console.error('Error creating user profile:', error);
    return null;
  }

  return data;
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user profile:', error);
    return null;
  }

  return data;
}

export async function getDailyLog(userId: string, date: string): Promise<DailyLog | null> {
  const { data, error } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('log_date', date)
    .maybeSingle();

  if (error) {
    console.error('Error fetching daily log:', error);
    return null;
  }

  return data;
}

export async function createDailyLog(userId: string, date: string): Promise<DailyLog | null> {
  const { data, error } = await supabase
    .from('daily_logs')
    .insert({
      user_id: userId,
      log_date: date,
      total_calories: 0,
      total_protein_g: 0,
      total_carbs_g: 0,
      total_fat_g: 0,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating daily log:', error);
    return null;
  }

  return data;
}

export async function getOrCreateDailyLog(userId: string, date: string): Promise<DailyLog | null> {
  let log = await getDailyLog(userId, date);

  if (!log) {
    log = await createDailyLog(userId, date);
  }

  return log;
}

export async function updateDailyLogTotals(dailyLogId: string): Promise<void> {
  const { data: meals, error: mealsError } = await supabase
    .from('meals')
    .select('calories, protein_g, carbs_g, fat_g')
    .eq('daily_log_id', dailyLogId);

  if (mealsError) {
    console.error('Error fetching meals for totals:', mealsError);
    return;
  }

  const totals = meals.reduce(
    (acc, meal) => ({
      total_calories: acc.total_calories + (meal.calories || 0),
      total_protein_g: acc.total_protein_g + (meal.protein_g || 0),
      total_carbs_g: acc.total_carbs_g + (meal.carbs_g || 0),
      total_fat_g: acc.total_fat_g + (meal.fat_g || 0),
    }),
    { total_calories: 0, total_protein_g: 0, total_carbs_g: 0, total_fat_g: 0 }
  );

  const { error: updateError } = await supabase
    .from('daily_logs')
    .update({ ...totals, updated_at: new Date().toISOString() })
    .eq('id', dailyLogId);

  if (updateError) {
    console.error('Error updating daily log totals:', updateError);
  }
}

export async function getMeals(dailyLogId: string): Promise<Meal[]> {
  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('daily_log_id', dailyLogId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching meals:', error);
    return [];
  }

  return data || [];
}

export async function createMeal(meal: Omit<Meal, 'id' | 'created_at'>): Promise<Meal | null> {
  const { data, error } = await supabase
    .from('meals')
    .insert(meal)
    .select()
    .single();

  if (error) {
    console.error('Error creating meal:', error);
    return null;
  }

  await updateDailyLogTotals(meal.daily_log_id);

  return data;
}

export async function updateMeal(mealId: string, updates: Partial<Meal>): Promise<Meal | null> {
  const { data: meal, error: fetchError } = await supabase
    .from('meals')
    .select('daily_log_id')
    .eq('id', mealId)
    .single();

  if (fetchError) {
    console.error('Error fetching meal for update:', fetchError);
    return null;
  }

  const { data, error } = await supabase
    .from('meals')
    .update(updates)
    .eq('id', mealId)
    .select()
    .single();

  if (error) {
    console.error('Error updating meal:', error);
    return null;
  }

  await updateDailyLogTotals(meal.daily_log_id);

  return data;
}

export async function deleteMeal(mealId: string): Promise<boolean> {
  const { data: meal, error: fetchError } = await supabase
    .from('meals')
    .select('daily_log_id')
    .eq('id', mealId)
    .single();

  if (fetchError) {
    console.error('Error fetching meal for deletion:', fetchError);
    return false;
  }

  const { error } = await supabase
    .from('meals')
    .delete()
    .eq('id', mealId);

  if (error) {
    console.error('Error deleting meal:', error);
    return false;
  }

  await updateDailyLogTotals(meal.daily_log_id);

  return true;
}
