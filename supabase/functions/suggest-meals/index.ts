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
    const { remainingCalories, remainingProtein, remainingCarbs, remainingFat, mealType } = await req.json();

    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiKey) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const openai = new OpenAI({ apiKey: openaiKey });

    const prompt = `You are a professional nutrition coach. A user has the following remaining nutritional balance for the day:
- Calories: ${remainingCalories} kcal
- Protein: ${remainingProtein}g
- Carbs: ${remainingCarbs}g
- Fat: ${remainingFat}g

The user is looking for a ${mealType || 'snack'}. 

Based on these specific targets, suggest 3 highly optimal food choices or simple meals that would help them hit these remaining numbers as closely as possible without significantly overshooting any of them.

For each suggestion, provide:
1. Name of the food/meal
2. Why it's a good choice for their current balance
3. Estimated calories, protein, carbs, and fat
4. A simple 'Log this' data structure

Return ONLY valid JSON in this exact format:
{
  "suggestions": [
    {
      "name": "Greek Yogurt with Berries",
      "reason": "High protein and low fat to help reach your protein goal while keeping calories in check.",
      "nutrients": {
        "calories": 150,
        "proteinG": 15,
        "carbsG": 12,
        "fatG": 2
      }
    }
  ]
}

If the remaining calories are very low (under 100), suggest light snacks. If they are over their limit, suggest a very light, fiber-rich option to stay full without adding much more.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("No response from AI");

    let cleanedContent = content.trim();
    if (cleanedContent.startsWith("```json")) {
      cleanedContent = cleanedContent.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    }

    return new Response(cleanedContent, {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
