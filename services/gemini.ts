import { GoogleGenAI } from "@google/genai";

export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("No API key found for Gemini");
    return "Beautiful fresh flowers arranged with care. (AI generation unavailable)";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a short, elegant, and emotional product description for a flower arrangement named "${productName}" which belongs to the "${category}" category. Keep it under 40 words.`,
    });
    return response.text || "Fresh and beautiful arrangement.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Hand-picked fresh flowers, arranged to perfection.";
  }
};