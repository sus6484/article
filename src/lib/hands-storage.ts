import { createNewHand, Hand } from "./types";

export const HANDS_STORAGE_KEY = "article-hands-data";

export interface HandsStorageData {
  hands: Hand[];
  activeHandId: string;
}

function createDefaultData(): HandsStorageData {
  const hand = createNewHand(1);
  return { hands: [hand], activeHandId: hand.id };
}

function isValidHand(hand: unknown): hand is Hand {
  if (!hand || typeof hand !== "object") return false;
  const h = hand as Hand;
  return (
    typeof h.id === "string" &&
    typeof h.name === "string" &&
    h.formData !== undefined &&
    typeof h.article === "string" &&
    Array.isArray(h.shortsTitles)
  );
}

export function loadHandsData(): HandsStorageData {
  if (typeof window === "undefined") return createDefaultData();

  try {
    const raw = localStorage.getItem(HANDS_STORAGE_KEY);
    if (!raw) return createDefaultData();

    const parsed = JSON.parse(raw) as HandsStorageData;
    if (!Array.isArray(parsed.hands) || parsed.hands.length === 0) {
      return createDefaultData();
    }

    const hands = parsed.hands.filter(isValidHand);
    if (hands.length === 0) return createDefaultData();

    const activeHandId = hands.some((h) => h.id === parsed.activeHandId)
      ? parsed.activeHandId
      : hands[0].id;

    return { hands, activeHandId };
  } catch {
    return createDefaultData();
  }
}

export function saveHandsData(hands: Hand[], activeHandId: string): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    HANDS_STORAGE_KEY,
    JSON.stringify({ hands, activeHandId })
  );
}
