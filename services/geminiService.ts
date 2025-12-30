
import { GoogleGenAI } from "@google/genai";

/**
 * Fix: Initialize GoogleGenAI strictly using process.env.API_KEY without fallback
 * as per the mandatory GenAI Coding Guidelines.
 */
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getStrategyAdvice = async (gameName: string, query: string) => {
  try {
    // Generate strategy advice using the specified model and prompt
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a professional Minecraft competitive analyst for the game: ${gameName}. 
      Give concise, elite-level advice on this topic: ${query}. 
      Focus on movement mechanics, build strategies, or combat tips. 
      Keep the response under 150 words and use a helpful but competitive tone.`,
      config: {
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
      }
    });
    // Fix: Access the text property directly (not as a method call) as per the SDK rules
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The AI analyst is currently offline preparing for the next tournament. Try again later!";
  }
};
