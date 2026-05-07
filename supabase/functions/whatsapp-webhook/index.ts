import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import OpenAI from "npm:openai@4.104.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") });

    // 1. Parse incoming Twilio Webhook (Form Data)
    const formData = await req.formData();
    const from = formData.get('From')?.toString() || ''; // e.g. "whatsapp:+971501234567"
    const body = formData.get('Body')?.toString() || '';
    
    const phone = from.replace('whatsapp:', '');

    // 2. Identify User
    const { data: profile, error: profileError } = await supabaseClient
      .from('user_profiles')
      .select('*')
      .eq('phone_number', phone)
      .single();

    if (profileError || !profile) {
      return new Response(generateTwilioResponse("I couldn't find your account. Please add your phone number in the CalorieTracker app settings!"), {
        headers: { 'Content-Type': 'text/xml' }
      });
    }

    // 3. AI Parse Message
    const prompt = `User Message: "${body}"
Identify the food items and estimate their nutritional content (Calories, Protein, Carbs, Fat). 
Respond ONLY with a JSON object: 
{ 
  "meals": [{ "name": string, "calories": number, "protein": number, "carbs": number, "fat": number }],
  "totalCalories": number,
  "summary": string 
}
If multiple items are mentioned, include them all. Be precise but helpful.`;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(aiResponse.choices[0].message.content || '{}');

    // 4. Create Daily Log & Log Meal
    const dateKey = new Date().toISOString().split('T')[0];
    let { data: dailyLog } = await supabaseClient
      .from('daily_logs')
      .select('id')
      .eq('user_id', profile.id)
      .eq('date', dateKey)
      .single();

    if (!dailyLog) {
      const { data: newLog } = await supabaseClient
        .from('daily_logs')
        .insert({ user_id: profile.id, date: dateKey })
        .select()
        .single();
      dailyLog = newLog;
    }

    // Insert the meals
    for (const meal of result.meals) {
      await supabaseClient.from('meals').insert({
        user_id: profile.id,
        daily_log_id: dailyLog.id,
        name: meal.name,
        meal_type: 'snacks', // Default to snacks for quick logs
        calories: meal.calories,
        protein_g: meal.protein,
        carbs_g: meal.carbs,
        fat_g: meal.fat
      });
    }

    // 5. Respond to WhatsApp
    const replyText = `✅ Logged! \n\n${result.summary}\n\nTotal: ${result.totalCalories} kcal added to your day. \n\nKeep it up, ${profile.full_name.split(' ')[0]}! 🇦🇪`;
    
    return new Response(generateTwilioResponse(replyText), {
      headers: { 'Content-Type': 'text/xml' }
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(generateTwilioResponse("Sorry, I had trouble logging that. Please try again!"), {
      headers: { 'Content-Type': 'text/xml' }
    });
  }
});

function generateTwilioResponse(message: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>${message}</Message>
</Response>`;
}
