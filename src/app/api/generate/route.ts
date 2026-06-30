import { NextRequest, NextResponse } from "next/server";
import { generateContent } from "@/lib/gemini";
import {
  ARTICLE_SYSTEM_PROMPT,
  formatHandDataForPrompt,
  parseShortsTitles,
} from "@/lib/prompts";
import { GenerateRequest } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { formData } = body;

    if (!formData) {
      return NextResponse.json(
        { error: "핸드 데이터가 필요합니다." },
        { status: 400 }
      );
    }

    const handData = formatHandDataForPrompt(formData);
    const userPrompt = `다음 홀덤 핸드 데이터를 바탕으로 기사를 작성해 줘:\n\n${handData}`;

    const rawContent = await generateContent(ARTICLE_SYSTEM_PROMPT, userPrompt);
    const { article, shortsTitles } = parseShortsTitles(rawContent);

    return NextResponse.json({
      article: article || rawContent,
      shortsTitles,
      rawContent,
    });
  } catch (error) {
    console.error("Generate article error:", error);
    const message =
      error instanceof Error ? error.message : "기사 생성 중 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
