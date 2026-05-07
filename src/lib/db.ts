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

export async function updateWaterIntake(dailyLogId: string, amountMl: number): Promise<DailyLog | null> {
  const { data, error } = await supabase
    .from('daily_logs')
    .update({ 
      water_ml: amountMl,
      updated_at: new Date().toISOString() 
    })
    .eq('id', dailyLogId)
    .select()
    .single();

  if (error) {
    console.error('Error updating water intake:', error);
    return null;
  }

  return data;
}

export async function logWeight(userId: string, weightKg: number): Promise<any | null> {
  const { data, error } = await supabase
    .from('weight_logs')
    .insert({ user_id: userId, weight_kg: weightKg })
    .select()
    .single();

  if (error) {
    console.error('Error logging weight:', error);
    return null;
  }

  await updateUserProfile(userId, { weight_kg: weightKg });
  return data;
}

export async function getWeightLogs(userId: string, limit: number = 30): Promise<any[]> {
  const { data, error } = await supabase
    .from('weight_logs')
    .select('*')
    .eq('user_id', userId)
    .order('logged_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching weight logs:', error);
    return [];
  }
  return data || [];
}

export async function getMealTemplates(userId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('meal_templates')
    .select('*')
    .eq('user_id', userId)
    .order('use_count', { ascending: false });

  if (error) {
    console.error('Error fetching templates:', error);
    return [];
  }
  return data || [];
}

export async function createMealTemplate(template: any): Promise<any | null> {
  const { data, error } = await supabase
    .from('meal_templates')
    .insert(template)
    .select()
    .single();

  if (error) {
    console.error('Error creating template:', error);
    return null;
  }
  return data;
}

export async function getWeeklyLogs(userId: string): Promise<any[]> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const dateStr = sevenDaysAgo.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('log_date', dateStr)
    .order('log_date', { ascending: true });

  if (error) {
    console.error('Error fetching weekly logs:', error);
    return [];
  }
  return data || [];
}

export async function getAchievements(userId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('user_achievements')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching achievements:', error);
    return [];
  }
  return data || [];
}

export async function checkAndUnlockAchievements(userId: string, context: { streak: number, totalMeals: number, waterToday: number, waterGoal: number }): Promise<string[]> {
  const unlocked: string[] = [];
  const currentAchievements = await getAchievements(userId);
  const types = currentAchievements.map(a => a.achievement_type);

  const check = async (type: string, condition: boolean) => {
    if (condition && !types.includes(type)) {
      const { error } = await supabase
        .from('user_achievements')
        .insert({ user_id: userId, achievement_type: type });
      
      if (!error) unlocked.push(type);
    }
  };

  // Conditions
  await check('HYDRATION_HERO', context.waterToday >= context.waterGoal);
  await check('STREAK_7', context.streak >= 7);
  await check('MEAL_MASTER', context.totalMeals >= 50);

  return unlocked;
}

// V2 Expansion: Food Search
export async function searchFoods(query: string, country: 'ae' | 'global' = 'ae') {
  // 1. Search local custom foods first
  const { data: localFoods, error: localError } = await supabase
    .from('custom_foods')
    .select('*')
    .or(`name_en.ilike.%${query}%,name_ar.ilike.%${query}%`)
    .limit(10);

  if (localError) console.error('Error searching local foods:', localError);

  // 2. Search Open Food Facts API
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?` +
      `search_terms=${encodeURIComponent(query)}` +
      `&search_simple=1` +
      `&action=process` +
      `&json=1` +
      `&fields=product_name,nutriments,serving_size,brands,image_url,id` +
      `&lc=ar,en` +
      `&tagtype_0=countries&tag_contains_0=contains&tag_0=${country === 'ae' ? 'United Arab Emirates' : ''}`
    );
    
    if (!response.ok) throw new Error('OFF API error');
    
    const data = await response.json();
    const offFoods = (data.products || []).map((p: any) => ({
      id: `off_${p.id}`,
      name_en: p.product_name,
      brand: p.brands,
      calories_per_100g: p.nutriments?.['energy-kcal_100g'] || 0,
      protein_per_100g: p.nutriments?.proteins_100g || 0,
      carbs_per_100g: p.nutriments?.carbohydrates_100g || 0,
      fat_per_100g: p.nutriments?.fat_100g || 0,
      image_url: p.image_url,
      is_off: true
    }));

    return [...(localFoods || []), ...offFoods];
  } catch (error) {
    console.error('Error searching OFF:', error);
    return localFoods || [];
  }
}

export async function getCustomFoods(userId?: string) {
  let query = supabase.from('custom_foods').select('*');
  if (userId) {
    query = query.or(`is_verified.eq.true,created_by.eq.${userId}`);
  } else {
    query = query.eq('is_verified', true);
  }
  
  const { data, error } = await query.order('name_en');
  if (error) console.error('Error fetching custom foods:', error);
  return data || [];
}

export async function createCustomFood(food: any) {
  const { data, error } = await supabase
    .from('custom_foods')
    .insert(food)
    .select()
    .single();
  
  if (error) console.error('Error creating custom food:', error);
  return data;
}

// V2 Expansion: Fasting
export async function getFastingSessions(userId: string) {
  const { data, error } = await supabase
    .from('fasting_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('start_time', { ascending: false });
  
  if (error) console.error('Error fetching fasting sessions:', error);
  return data || [];
}

export async function createFastingSession(session: any) {
  const { data, error } = await supabase
    .from('fasting_sessions')
    .insert(session)
    .select()
    .single();
  
  if (error) console.error('Error creating fasting session:', error);
  return data;
}

export async function updateFastingSession(sessionId: string, updates: any) {
  const { data, error } = await supabase
    .from('fasting_sessions')
    .update(updates)
    .eq('id', sessionId)
    .select()
    .single();
  
  if (error) console.error('Error updating fasting session:', error);
  return data;
}

// V2 Expansion: Exercise
export async function getExerciseLogs(userId: string, date?: string) {
  let query = supabase.from('exercise_logs').select('*').eq('user_id', userId);
  
  if (date) {
    const start = `${date}T00:00:00Z`;
    const end = `${date}T23:59:59Z`;
    query = query.gte('logged_at', start).lte('logged_at', end);
  }
  
  const { data, error } = await query.order('logged_at', { ascending: false });
  if (error) console.error('Error fetching exercise logs:', error);
  return data || [];
}

export async function createExerciseLog(log: any) {
  const { data, error } = await supabase
    .from('exercise_logs')
    .insert(log)
    .select()
    .single();
  
  if (error) console.error('Error creating exercise log:', error);
  return data;
}

// V2 Expansion: Recipes
export async function getRecipes(tags?: string[]) {
  let query = supabase.from('recipes').select('*');
  if (tags && tags.length > 0) {
    query = query.contains('tags', tags);
  }
  
  const { data, error } = await query.order('is_featured', { ascending: false });
  if (error) console.error('Error fetching recipes:', error);
  return data || [];
}

// V2 Expansion: NutriChat
export async function getNutriChatMessages(userId: string) {
  const { data, error } = await supabase
    .from('nutrichat_messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });
  
  if (error) console.error('Error fetching chat messages:', error);
  return data || [];
}

export async function createNutriChatMessage(message: any) {
  const { data, error } = await supabase
    .from('nutrichat_messages')
    .insert(message)
    .select()
    .single();
  
  if (error) console.error('Error creating chat message:', error);
  return data;
}
