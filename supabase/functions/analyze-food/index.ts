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
    const { imageBase64 } = await req.json();

    console.log("Received request with image data:", imageBase64 ? `${imageBase64.length} chars` : "none");

    if (!imageBase64) {
      console.error("No image data provided");
      return new Response(
        JSON.stringify({ error: "Image data is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    console.log("OpenAI API key present:", openaiKey ? "yes" : "no");

    if (!openaiKey) {
      console.error("OpenAI API key not configured");
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const openai = new OpenAI({
      apiKey: openaiKey,
    });

    console.log("Calling OpenAI API...");

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are a nutrition expert. Analyze this food image and identify all food items visible. For each item, provide:
              
1. Food name (be specific, e.g., "Grilled Chicken Breast" not just "Chicken")
2. Estimated portion size in common measurements (oz, cups, pieces, grams)
3. Calories
4. Protein in grams
5. Carbohydrates in grams
6. Fat in grams
7. Confidence score (0.0 to 1.0)

Return ONLY valid JSON in this exact format with no additional text:
{
  "foods": [
    {
      "name": "Grilled Chicken Breast",
      "portionSize": "6 oz",
      "calories": 280,
      "proteinG": 53,
      "carbsG": 0,
      "fatG": 6,
      "confidence": 0.92
    }
  ]
}

If you cannot identify any food, return: {"foods": [], "error": "No food detected"}

Be as accurate as possible with nutritional values based on standard USDA food data.`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content;
    console.log("OpenAI response content:", content);

    if (!content) {
      console.error("No content in OpenAI response");
      return new Response(
        JSON.stringify({ error: "No response from AI" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let cleanedContent = content.trim();
    if (cleanedContent.startsWith("```json")) {
      cleanedContent = cleanedContent.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (cleanedContent.startsWith("```")) {
      cleanedContent = cleanedContent.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }
    console.log("Cleaned content:", cleanedContent);

    const result = JSON.parse(cleanedContent);
    console.log("Parsed result:", JSON.stringify(result));

    if (result.foods) {
      result.foods = result.foods.map((food: any, index: number) => ({
        id: `food_${Date.now()}_${index}`,
        ...food,
      }));
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error analyzing food:", error);
    console.error("Error details:", error instanceof Error ? error.message : String(error));
    return new Response(
      JSON.stringify({
        error: "Failed to analyze food. Please try again.",
        details: error instanceof Error ? error.message : String(error)
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});