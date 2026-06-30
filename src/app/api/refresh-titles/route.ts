import { NextRequest, NextResponse } from "next/server";
import { generateContent } from "@/lib/gemini";
import { TITLES_ONLY_PROMPT } from "@/lib/prompts";
import { RefreshTitlesRequest } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body: RefreshTitlesRequest = await request.json();
    const { article, formData, revisionNote } = body;

    if (!article) {
      return NextResponse.json(
        { error: "기사 내용이 필요합니다." },
        { status: 400 }
      );
    }

    const revisionSection = revisionNote?.trim()
      ? `\n\n[수정 요구사항]\n${revisionNote.trim()}\n\n위 요구사항을 반영하여 쇼츠 제목을 다시 작성해 줘.`
      : "";

    const context = [
      `대회명: ${formData?.tournamentName || ""}`,
      "",
      "[기사 내용]",
      article,
      revisionSection,
    ].join("\n");

    const rawContent = await generateContent(TITLES_ONLY_PROMPT, context);

    let shortsTitles: string[] = [];
    try {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]) as { titles?: string[] };
        shortsTitles = parsed.titles?.slice(0, 5) ?? [];
      }
    } catch {
      const lines = rawContent
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith("{") && !l.startsWith("}"));
      shortsTitles = lines
        .map((l) => l.replace(/^[-*#\d\.\)\s"]+|["]+$/g, "").trim())
        .filter(Boolean)
        .slice(0, 5);
    }

    if (shortsTitles.length === 0) {
      return NextResponse.json(
        { error: "쇼츠 제목을 생성하지 못했습니다. 다시 시도해 주세요." },
        { status: 500 }
      );
    }

    return NextResponse.json({ shortsTitles });
  } catch (error) {
    console.error("Refresh titles error:", error);
    const message =
      error instanceof Error ? error.message : "제목 생성 중 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
