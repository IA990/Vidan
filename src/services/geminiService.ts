import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("Gemini API key is missing. Please ensure GEMINI_API_KEY is set in your environment.");
}
const ai = new GoogleGenAI({ apiKey });

export async function generateOptimizedMetadata(title: string, description: string, tags: string[]) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `As a YouTube SEO expert, optimize the following video metadata for maximum reach and engagement.
    Current Title: ${title}
    Current Description: ${description}
    Current Tags: ${tags.join(", ")}
    
    Provide:
    1. Titles: A list of 5 catchy, SEO-friendly Titles.
    2. Description: An optimized description with timestamps and links placeholders.
    3. Tags: 20 high-ranking tags.
    4. Strategy: A brief SEO strategy for this video.
    
    Format the output as a JSON object with keys: "Titles", "Description", "Tags", "Strategy".`,
    config: {
      responseMimeType: "application/json"
    }
  });
  
  return response.text;
}

export async function analyzeKeywords(keyword: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the YouTube search potential for the keyword: "${keyword}".
    Provide:
    1. Search Volume (Low, Medium, High, Very High)
    2. Competition (Low, Medium, High)
    3. Overall Score (0-100)
    4. Related Keywords (top 10)
    5. Content Ideas based on this keyword.
    
    Format the output as a JSON object with keys: "Search Volume", "Competition", "Overall Score", "Related Keywords", "Content Ideas".`,
    config: {
      responseMimeType: "application/json"
    }
  });

  return response.text;
}
