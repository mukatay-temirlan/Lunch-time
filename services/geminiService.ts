import { GoogleGenAI } from "@google/genai";
import { VoteRecord, VoteOption } from "../types";

const createClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is not defined in process.env");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateLunchSummary = async (votes: VoteRecord[]): Promise<string> => {
  const ai = createClient();
  if (!ai) return "AI services unavailable (Missing API Key).";

  const attendees = votes
    .filter((v) => v.option === VoteOption.YES)
    .map((v) => v.userName);
    
  const absentees = votes
    .filter((v) => v.option === VoteOption.NO)
    .map((v) => v.userName);

  const prompt = `
    You are a cheerful team lunch coordinator bot.
    
    Here is the voting status for today's lunch:
    Going (${attendees.length}): ${attendees.join(', ')}
    Not Going (${absentees.length}): ${absentees.join(', ')}
    
    Tasks:
    1. Summarize the turnout in a fun, witty way.
    2. Suggest a type of cuisine or restaurant vibe suitable for a group of ${attendees.length} people.
    3. Keep it under 50 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Couldn't generate summary.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The chef is currently on break (API Error).";
  }
};
