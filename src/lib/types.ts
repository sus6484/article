export interface HandFormData {
  tournamentName: string;
  remainingPlayers: string;
  totalPlayers: string;
  blindsAnte: string;
  preFlop: string;
  holeCards: string;
  flopCards: string;
  flopAction: string;
  turnCards: string;
  turnAction: string;
  riverCards: string;
}

export interface Hand {
  id: string;
  name: string;
  formData: HandFormData;
  article: string;
  shortsTitles: string[];
}

export const createEmptyFormData = (): HandFormData => ({
  tournamentName: "",
  remainingPlayers: "",
  totalPlayers: "",
  blindsAnte: "",
  preFlop: "",
  holeCards: "",
  flopCards: "",
  flopAction: "",
  turnCards: "",
  turnAction: "",
  riverCards: "",
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
}
