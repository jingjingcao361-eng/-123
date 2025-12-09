import { GoogleGenAI } from "@google/genai";

// Initialize the GenAI client
// Note: This service is currently a placeholder for potential future features
// such as generating custom Christmas greetings or dynamic tree color themes based on user mood.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateGreeting = async (name: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY not found in environment variables. Returning mock data.");
    return `Merry Christmas, ${name}! Welcome to the Arix Signature Experience.`;
  }

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Write a very short, elegant, high-end luxury christmas greeting for a user named ${name}. Max 15 words.`,
    });
    return response.text || "Season's Greetings.";
  } catch (error) {
    console.error("Error generating greeting:", error);
    return "Season's Greetings from Arix.";
  }
};