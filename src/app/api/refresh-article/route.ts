import { DEFAULT_ARTICLE_STYLE } from "@/lib/article-style";
import { NextRequest, NextResponse } from "next/server";
import { generateContent } from "@/lib/gemini";
import {
  getArticleSystemPrompt,
  formatHandDataForPrompt,
  parseShortsTitles,
} from "@/lib/prompts";
import { RefreshArticleRequest } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body: RefreshArticleRequest = await request.json();
    const { formData, article, styleConfig, revisionNote } = body;

    if (!formData) {
      return NextResponse.json(
        { error: "핸드 데이터가 필요합니다." },
        { status: 400 }
      );
    }

    if (!article) {
      return NextResponse.json(
        { error: "기사 내용이 필요합니다." },
        { status: 400 }
      );
    }

    const handData = formatHandDataForPrompt(formData);
    const effectiveStyle = styleConfig?.userCustomized
      ? styleConfig
      : DEFAULT_ARTICLE_STYLE;

    const revisionSection = revisionNote?.trim()
      ? `\n\n[수정 요구사항]\n${revisionNote.trim()}\n\n위 요구사항을 반영하여 기사를 다시 작성해 줘.`
      : `\n\n현재 기사를 참고하여 품질을 개선한 새 버전을 작성해 줘.`;

    const userPrompt = `다음 홀덤 핸드 데이터를 바탕으로 기사를 작성해 줘. 출력 틀의 섹션 순서와 구조를 그대로 지키고, 입력에 없는 정보는 추측하지 마.

[현재 기사 (참고용)]
${article}
${revisionSection}

${handData}`;

    const rawContent = await generateContent(
      getArticleSystemPrompt(effectiveStyle),
      userPrompt
    );
    const { article: newArticle, shortsTitles } = parseShortsTitles(rawContent);

    return NextResponse.json({
      article: newArticle || rawContent,
      shortsTitles,
    });
  } catch (error) {
    console.error("Refresh article error:", error);
    const message =
      error instanceof Error ? error.message : "기사 재생성 중 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
