import { ArticleStyleConfig, DEFAULT_ARTICLE_STYLE, buildArticleSystemPrompt } from "./article-style";
import { formatBlindsOrAnte } from "./chip-format";
import { formatDateForPrompt } from "./date-format";
import { CardOpenEntry, HandFormData, StreetData } from "./types";

export function getArticleSystemPrompt(style?: ArticleStyleConfig): string {
  return buildArticleSystemPrompt(style ?? DEFAULT_ARTICLE_STYLE);
}

export const TITLES_ONLY_PROMPT = `너는 프로 홀덤 토너먼트 e스포츠 미디어 담당자야. 제공된 기사 내용을 바탕으로 유튜브 쇼츠용 어그로/후킹이 강한 제목 5개만 작성해 줘.

반드시 아래 JSON 형식으로만 응답해 줘:
{"titles": ["제목1", "제목2", "제목3", "제목4", "제목5"]}`;

function formatStreet(
  name: string,
  street: StreetData,
  includeCards = true
): string[] {
  const lines = [`[${name}]`];

  if (includeCards && street.cards) {
    lines.push(`카드: ${street.cards}`);
  }

  for (const entry of street.entries) {
    if (entry.position || entry.action) {
      lines.push(
        `${entry.position || "(포지션)"}: ${entry.action || "(액션)"}`
      );
    }
  }

  if (lines.length === 1) {
    lines.push("(미입력)");
  }

  return lines;
}

function formatCardOpen(entries: CardOpenEntry[]): string[] {
  const lines = ["[CARD OPEN]"];

  for (const entry of entries) {
    if (entry.position || entry.card) {
      lines.push(
        `${entry.position || "(포지션)"}: ${entry.card || "(카드)"}`
      );
    }
  }

  if (lines.length === 1) {
    lines.push("(미입력)");
  }

  return lines;
}

export function formatHandDataForPrompt(formData: HandFormData): string {
  const lines = [
    `날짜: ${formatDateForPrompt(formData.date)}`,
    `대회명: ${formData.tournamentName || "(미입력)"}`,
    `남은 인원 / 총 플레이어: ${formData.remainingPlayers || "?"} / ${formData.totalPlayers || "?"}`,
    `블라인드: ${formData.blinds ? formatBlindsOrAnte(formData.blinds) : "(미입력)"}`,
    `엔티: ${formData.ante ? formatBlindsOrAnte(formData.ante) : "(미입력)"}`,
    "",
    ...formatStreet("Pre-flop", formData.preFlop, false),
    "",
    ...formatStreet("Flop", formData.flop),
    "",
    ...formatStreet("Turn", formData.turn),
    "",
    ...formatStreet("River", formData.river),
    "",
    ...formatCardOpen(formData.cardOpen ?? []),
  ];

  if (formData.situationDescription?.trim()) {
    lines.push("");
    lines.push("[부가 상황 설명]");
    lines.push(formData.situationDescription.trim());
  }

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
