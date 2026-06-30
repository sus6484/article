import { HandFormData } from "./types";

function normalizeSingleChipAmount(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;

  const normalized = trimmed.replace(/,/g, "").replace(/\s+/g, "");

  const kMatch = normalized.match(/^(\d+(?:\.\d+)?)[kK]$/);
  if (kMatch) {
    const kValue = parseFloat(kMatch[1]);
    return Number.isInteger(kValue) ? `${kValue}K` : `${kValue}K`;
  }

  const num = parseFloat(normalized);
  if (Number.isNaN(num)) return trimmed;

  if (num >= 1000) {
    const k = num / 1000;
    return Number.isInteger(k) ? `${k}K` : `${parseFloat(k.toFixed(1))}K`;
  }

  return trimmed;
}

export function formatBlindsOrAnte(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;

  if (/\s*\/\s*/.test(trimmed)) {
    return trimmed
      .split(/\s*\/\s*/)
      .map((part) => normalizeSingleChipAmount(part))
      .join("/");
  }

  return normalizeSingleChipAmount(trimmed);
}

export function normalizeHandFormChipFields(
  formData: HandFormData
): HandFormData {
  return {
    ...formData,
    blinds: formData.blinds ? formatBlindsOrAnte(formData.blinds) : "",
    ante: formData.ante ? formatBlindsOrAnte(formData.ante) : "",
  };
}

export function formatBlindsAnteInArticle(article: string): string {
  return article
    .replace(
      /블라인드\s+(.+?)(?=,\s*엔티|\s+상황|\s+에서|\s+이며|\.|$)/g,
      (_, amounts: string) => `블라인드 ${formatBlindsOrAnte(amounts.trim())}`
    )
    .replace(
      /엔티\s+(.+?)(?=,\s|\s+상황|\s+에서|\s+이며|\.|$)/g,
      (_, amount: string) => `엔티 ${formatBlindsOrAnte(amount.trim())}`
    );
}
