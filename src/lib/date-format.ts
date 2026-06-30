export interface DateParts {
  year: string;
  month: string;
  day: string;
}

export function parseDateParts(dateStr: string): DateParts {
  if (!dateStr?.trim()) {
    return { year: "", month: "", day: "" };
  }

  const match = dateStr.trim().match(/^(\d{4})[-./](\d{1,2})[-./](\d{1,2})$/);
  if (!match) {
    return { year: "", month: "", day: "" };
  }

  return {
    year: match[1],
    month: String(parseInt(match[2], 10)),
    day: String(parseInt(match[3], 10)),
  };
}

export function combineDateParts(
  year: string,
  month: string,
  day: string
): string {
  const y = year.trim();
  const m = month.trim();
  const d = day.trim();

  if (!y || !m || !d || !/^\d{4}$/.test(y)) {
    return "";
  }

  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

export function formatDateDot(dateStr: string): string {
  const { year, month, day } = parseDateParts(dateStr);
  if (!year || !month || !day) {
    return dateStr || "";
  }

  return `${year}.${month.padStart(2, "0")}.${day.padStart(2, "0")}`;
}

export function formatDateKorean(dateStr: string): string {
  const { year, month, day } = parseDateParts(dateStr);
  if (!year || !month || !day) {
    return dateStr || "";
  }

  return `${year}년 ${parseInt(month, 10)}월 ${parseInt(day, 10)}일`;
}

export function formatDateForPrompt(dateStr: string): string {
  if (!dateStr?.trim()) {
    return "(미입력)";
  }

  const dot = formatDateDot(dateStr);
  const korean = formatDateKorean(dateStr);

  if (dot === dateStr && !parseDateParts(dateStr).year) {
    return dateStr;
  }

  return `${dot} (${korean})`;
}
