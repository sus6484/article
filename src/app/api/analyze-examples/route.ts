import { NextRequest, NextResponse } from "next/server";
import { generateContent } from "@/lib/gemini";

const ANALYZE_SYSTEM_PROMPT = `너는 홀덤 토너먼트 기사 편집 전문가다. 사용자가 제공한 기사 예시들을 분석해, 같은 스타일로 새 기사를 쓸 수 있도록 출력 틀과 작성 규칙을 추출한다.

반드시 아래 JSON 형식으로만 응답한다. 다른 설명은 붙이지 않는다.

{
  "skeleton": "마크다운 출력 틀. 실제 내용 대신 {제목}, {날짜}, {본문} 같은 플레이스홀더를 사용한다. 예시 기사의 섹션 순서, 헤딩 레벨, 구분선, 불릿 구조를 그대로 반영한다.",
  "rules": "작성 규칙을 불릿 목록으로 정리. 문체, 문장 길이, 톤, 강조 방식, 금지 사항 등을 구체적으로 적는다."
}`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const examples: string[] = (body.examples ?? [])
      .map((ex: string) => ex.trim())
      .filter((ex: string) => ex.length > 0);

    if (examples.length === 0) {
      return NextResponse.json(
        { error: "분석할 예시 기사를 1개 이상 입력해 주세요." },
        { status: 400 }
      );
    }

    const userPrompt = `아래 ${examples.length}개의 홀덤 토너먼트 기사 예시를 분석해, 공통된 출력 틀(skeleton)과 작성 규칙(rules)을 JSON으로 추출해 줘.

${examples.map((ex, i) => `--- 예시 ${i + 1} ---\n${ex}`).join("\n\n")}`;

    const raw = await generateContent(ANALYZE_SYSTEM_PROMPT, userPrompt);

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("예시 분석 결과를 파싱하지 못했습니다. 다시 시도해 주세요.");
    }

    const parsed = JSON.parse(jsonMatch[0]) as {
      skeleton?: string;
      rules?: string;
    };

    if (!parsed.skeleton?.trim() || !parsed.rules?.trim()) {
      throw new Error("분석 결과에 틀 또는 규칙이 누락되었습니다.");
    }

    return NextResponse.json({
      skeleton: parsed.skeleton.trim(),
      rules: parsed.rules.trim(),
      examples,
    });
  } catch (error) {
    console.error("Analyze examples error:", error);
    const message =
      error instanceof Error ? error.message : "예시 분석 중 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
