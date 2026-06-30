export interface ActionEntry {
  position: string;
  action: string;
}

export interface CardOpenEntry {
  position: string;
  card: string;
}

export interface StreetData {
  cards: string;
  entries: ActionEntry[];
}

export interface HandFormData {
  date: string;
  tournamentName: string;
  remainingPlayers: string;
  totalPlayers: string;
  blinds: string;
  ante: string;
  preFlop: StreetData;
  flop: StreetData;
  turn: StreetData;
  river: StreetData;
  cardOpen: CardOpenEntry[];
  situationDescription: string;
}

export interface Hand {
  id: string;
  name: string;
  formData: HandFormData;
  article: string;
  shortsTitles: string[];
}

export const createEmptyStreetData = (): StreetData => ({
  cards: "",
  entries: [
    { position: "", action: "" },
    { position: "", action: "" },
  ],
});

export const createEmptyCardOpenData = (): CardOpenEntry[] => [
  { position: "", card: "" },
  { position: "", card: "" },
];

export const createEmptyFormData = (): HandFormData => ({
  date: "",
  tournamentName: "",
  remainingPlayers: "",
  totalPlayers: "",
  blinds: "",
  ante: "",
  preFlop: createEmptyStreetData(),
  flop: createEmptyStreetData(),
  turn: createEmptyStreetData(),
  river: createEmptyStreetData(),
  cardOpen: createEmptyCardOpenData(),
  situationDescription: "",
});

export const createNewHand = (index: number): Hand => ({
  id: crypto.randomUUID(),
  name: `핸드 ${index}`,
  formData: createEmptyFormData(),
  article: "",
  shortsTitles: [],
});

export interface GenerateRequest {
  formData: HandFormData;
}

export interface RefreshTitlesRequest {
  article: string;
  formData: HandFormData;
};
