import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL_NAME = "gemini-1.5-flash";

export function getGeminiModel(systemPrompt?: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY가 설정되지 않았습니다. .env.local 파일을 확인해 주세요.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: MODEL_NAME,
    ...(systemPrompt ? { systemInstruction: systemPrompt } : {}),
  });
}

export async function generateContent(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const model = getGeminiModel(systemPrompt);
  const result = await model.generateContent(userPrompt);

  const text = result.response.text();
  if (!text) {
    throw new Error("Gemini API에서 응답을 받지 못했습니다.");
  }
  return text;
}
