import { HandFormData } from "./types";

export const ARTICLE_SYSTEM_PROMPT = `너는 프로 홀덤 토너먼트 e스포츠 기자야. 제공된 핸드 데이터를 바탕으로 생동감 있고 전문적인 기사를 작성해 줘. 기사 형식은 다음을 반드시 지켜:
1) 제목: 대회명, 우승자/탈락자, 핵심 카드 상황을 요약한 강렬한 제목
2) 첫 문단: 날짜, 대회명, 블라인드 및 엔티 상황, 남은 인원 요약
3) 블릿 포인트 요약: Pre-flop 상황, Showdown (홀카드), 보드(Flop, Turn, River) 정리
4) 본문: 상황에 대한 극적인 스토리텔링 (누가 어떤 페어를 맞췄고, 턴과 리버에서 어떻게 상황이 역전되거나 확정되었는지 묘사)
5) 기사 출력 후, 하단에 유튜브 쇼츠용 어그로/후킹이 강한 제목 5개를 '쇼츠 제목 추천'이라는 헤딩 아래에 작성해 줘.

기사는 마크다운 형식으로 작성해 줘. 제목은 **볼드**로 강조해 줘.`;

export const TITLES_ONLY_PROMPT = `너는 프로 홀덤 토너먼트 e스포츠 미디어 담당자야. 제공된 기사 내용을 바탕으로 유튜브 쇼츠용 어그로/후킹이 강한 제목 5개만 작성해 줘.

반드시 아래 JSON 형식으로만 응답해 줘:
{"titles": ["제목1", "제목2", "제목3", "제목4", "제목5"]}`;

export function formatHandDataForPrompt(formData: HandFormData): string {
  const lines = [
    `대회명: ${formData.tournamentName || "(미입력)"}`,
    `남은 인원 / 총 플레이어: ${formData.remainingPlayers || "?"} / ${formData.totalPlayers || "?"}`,
    `블라인드 / 엔티: ${formData.blindsAnte || "(미입력)"}`,
    "",
    `[Pre-flop]`,
    formData.preFlop || "(미입력)",
    "",
    `[Hole Cards]`,
    formData.holeCards || "(미입력)",
    "",
    `[Flop]`,
    `카드: ${formData.flopCards || "(미입력)"}`,
    formData.flopAction ? `액션: ${formData.flopAction}` : "",
    "",
    `[Turn]`,
    `카드: ${formData.turnCards || "(미입력)"}`,
    formData.turnAction ? `액션: ${formData.turnAction}` : "",
    "",
    `[River]`,
    `카드: ${formData.riverCards || "(미입력)"}`,
  ];

  return lines.filter((line, i, arr) => !(line === "" && arr[i + 1] === "")).join("\n");
}

export function parseShortsTitles(content: string): {
  article: string;
  shortsTitles: string[];
} {
  const headingPatterns = [
    /##?\s*쇼츠\s*제목\s*추천/i,
    /\*\*쇼츠\s*제목\s*추천\*\*/i,
    /쇼츠\s*제목\s*추천\s*[:：]?/i,
  ];

  let splitIndex = -1;
  for (const pattern of headingPatterns) {
    const match = content.match(pattern);
    if (match && match.index !== undefined) {
      splitIndex = match.index;
      break;
    }
  }

  if (splitIndex === -1) {
    return { article: content.trim(), shortsTitles: [] };
  }

  const article = content.slice(0, splitIndex).trim();
  const titlesSection = content.slice(splitIndex);

  const titles: string[] = [];
  const numberedMatches = titlesSection.matchAll(/^\s*(?:\d+[\.\)]\s*|[-*]\s*)(.+)$/gm);
  for (const match of numberedMatches) {
    const title = match[1].replace(/^\*\*|\*\*$/g, "").trim();
    if (title && !title.match(/쇼츠\s*제목/i)) {
      titles.push(title);
    }
  }

  if (titles.length === 0) {
    const lines = titlesSection
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && !l.match(/쇼츠\s*제목|^[#*]+$/));
    for (const line of lines) {
      const cleaned = line.replace(/^[-*#\d\.\)\s]+/, "").replace(/^\*\*|\*\*$/g, "").trim();
      if (cleaned) titles.push(cleaned);
    }
  }

  return { article, shortsTitles: titles.slice(0, 5) };
}
