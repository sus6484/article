import { DEFAULT_ARTICLE_STYLE } from "@/lib/article-style";
import {
  formatBlindsAnteInArticle,
  normalizeHandFormChipFields,
} from "@/lib/chip-format";
import { NextRequest, NextResponse } from "next/server";
import { generateContent } from "@/lib/gemini";
import {
  getArticleSystemPrompt,
  formatHandDataForPrompt,
  parseShortsTitles,
} from "@/lib/prompts";
import { GenerateRequest } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { formData, styleConfig } = body;

    if (!formData) {
      return NextResponse.json(
        { error: "핸드 데이터가 필요합니다." },
        { status: 400 }
      );
    }

    const normalizedFormData = normalizeHandFormChipFields(formData);
    const handData = formatHandDataForPrompt(normalizedFormData);
    const effectiveStyle = styleConfig?.userCustomized
      ? styleConfig
      : DEFAULT_ARTICLE_STYLE;
    const userPrompt = `다음 홀덤 핸드 데이터를 바탕으로 기사를 작성해 줘. 출력 틀의 섹션 순서와 구조를 그대로 지키고, 입력에 없는 정보는 추측하지 마.

${handData}`;

    const rawContent = await generateContent(
      getArticleSystemPrompt(effectiveStyle),
      userPrompt
    );
    const { article, shortsTitles } = parseShortsTitles(rawContent);
    const formattedArticle = formatBlindsAnteInArticle(article || rawContent);

    return NextResponse.json({
      article: formattedArticle,
      shortsTitles,
      formData: normalizedFormData,
      rawContent,
    });
  } catch (error) {
    console.error("Generate article error:", error);
    const message =
      error instanceof Error ? error.message : "기사 생성 중 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
