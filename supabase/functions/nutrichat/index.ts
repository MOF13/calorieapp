import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import OpenAI from "npm:openai@4.104.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { message, profile, history } = await req.json();

    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiKey) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const openai = new OpenAI({ apiKey: openaiKey });

    const systemPrompt = `You are "NutriChat", a high-performance AI Nutrition Coach for the CalorieTracker platform in the UAE.
Your mission is to help users reach their health goals (weight loss, muscle gain, maintenance) with precision and cultural empathy.

USER CONTEXT:
- Name: ${profile?.full_name || 'Athlete'}
- Goal: ${profile?.goal_type || 'Unknown'}
- Current Weight: ${profile?.weight_kg}kg
- Target Weight: ${profile?.target_weight_kg || 'Not set'}kg
- Language: ${profile?.preferred_language || 'English/Arabic'}
- Timezone: ${profile?.timezone || 'Asia/Dubai'}

GUIDELINES:
1. **UAE Localization**: You are an expert in Middle Eastern and Emirati cuisine (Shawarma, Mandi, Harees, Machboos, dates, Arabic coffee). When suggesting food, prioritize healthy versions of local dishes or common supermarket items in the UAE (e.g. Al Rawabi, Almarai).
2. **Arabic Support**: If the user speaks in Arabic, respond in Arabic. Otherwise, respond in English but you can use common Arabic phrases like "Marhaba", "Inshallah", "Afiyah".
3. **Conversational & Professional**: Be supportive but data-driven. Don't give generic medical advice; focus on nutrition, macros, and behavioral habits.
4. **Ramadan Awareness**: If the current date/context suggests Ramadan, provide advice on Suhoor and Iftar timings and hydration.
5. **Short & Punchy**: Keep responses concise and formatted with bullet points for readability.

Respond to the user's latest message based on the context above.`;

    const chatHistory = history.map((m: any) => ({
      role: m.role,
      content: m.content
    }));

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        ...chatHistory,
        { role: "user", content: message }
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    const reply = response.choices[0]?.message?.content;

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
