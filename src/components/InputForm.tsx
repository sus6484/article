"use client";

import {
  ActionEntry,
  CardOpenEntry,
  createEmptyCardOpenData,
  HandFormData,
  StreetData,
} from "@/lib/types";

interface InputFormProps {
  formData: HandFormData;
  onChange: (data: HandFormData) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

function StreetRow({
  label,
  streetData,
  onChange,
  showCards = true,
}: {
  label: string;
  streetData: StreetData;
  onChange: (data: StreetData) => void;
  showCards?: boolean;
}) {
  const updateCards = (cards: string) => {
    onChange({ ...streetData, cards });
  };

  const updateEntry = (
    index: number,
    field: keyof ActionEntry,
    value: string
  ) => {
    const entries = [...streetData.entries];
    entries[index] = { ...entries[index], [field]: value };
    onChange({ ...streetData, entries });
  };

  const addEntry = () => {
    onChange({
      ...streetData,
      entries: [...streetData.entries, { position: "", action: "" }],
    });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
      <div className="mb-3 flex items-center gap-3">
        <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-brand">
          {label}
        </span>
        {showCards && (
          <div className="flex flex-1 items-center gap-2">
            <label className="shrink-0 text-xs text-gray-500">카드</label>
            <input
              type="text"
              className="input-field flex-1"
              value={streetData.cards}
              onChange={(e) => updateCards(e.target.value)}
            />
          </div>
        )}
      </div>
      <div className="space-y-2">
        {streetData.entries.map((entry, i) => (
          <div key={i} className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-xs text-gray-500">포지션</label>
              <input
                type="text"
                className="input-field"
                value={entry.position}
                onChange={(e) => updateEntry(i, "position", e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">액션</label>
              <input
                type="text"
                className="input-field"
                value={entry.action}
                onChange={(e) => updateEntry(i, "action", e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addEntry}
        className="mt-2 flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-600 hover:bg-gray-100"
        aria-label="포지션/액션 추가"
      >
        +
      </button>
    </div>
  );
}

function CardOpenRow({
  entries,
  onChange,
}: {
  entries: CardOpenEntry[];
  onChange: (entries: CardOpenEntry[]) => void;
}) {
  const updateEntry = (
    index: number,
    field: keyof CardOpenEntry,
    value: string
  ) => {
    const next = [...entries];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  const addEntry = () => {
    onChange([...entries, { position: "", card: "" }]);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
      <div className="mb-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand">
          CARD OPEN
        </span>
      </div>
      <div className="space-y-2">
        {entries.map((entry, i) => (
          <div key={i} className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-xs text-gray-500">포지션</label>
              <input
                type="text"
                className="input-field"
                value={entry.position}
                onChange={(e) => updateEntry(i, "position", e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">카드</label>
              <input
                type="text"
                className="input-field"
                value={entry.card}
                onChange={(e) => updateEntry(i, "card", e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addEntry}
        className="mt-2 flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-600 hover:bg-gray-100"
        aria-label="포지션/카드 추가"
      >
        +
      </button>
    </div>
  );
}

export default function InputForm({
  formData,
  onChange,
  onGenerate,
  isGenerating,
}: InputFormProps) {
  const update = <K extends keyof HandFormData>(
    field: K,
    value: HandFormData[K]
  ) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <section className="space-y-5">
      <div>
        <h2 className="mb-4 text-lg font-bold text-gray-900">핸드 정보 입력</h2>
      </div>

      <div>
        <label className="label-text">날짜</label>
        <input
          type="date"
          className="input-field"
          value={formData.date ?? ""}
          onChange={(e) => update("date", e.target.value)}
        />
      </div>

      <div>
        <label className="label-text">대회명</label>
        <input
          type="text"
          className="input-field"
          value={formData.tournamentName}
          onChange={(e) => update("tournamentName", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <label className="label-text">남은 인원</label>
          <input
            type="number"
            min="1"
            className="input-field"
            value={formData.remainingPlayers}
            onChange={(e) => update("remainingPlayers", e.target.value)}
          />
        </div>

        <div>
          <label className="label-text">총 플레이어</label>
          <input
            type="number"
            min="1"
            className="input-field"
            value={formData.totalPlayers}
            onChange={(e) => update("totalPlayers", e.target.value)}
          />
        </div>

        <div>
          <label className="label-text">블라인드</label>
          <input
            type="text"
            className="input-field"
            value={formData.blinds}
            onChange={(e) => update("blinds", e.target.value)}
          />
        </div>

        <div>
          <label className="label-text">엔티</label>
          <input
            type="text"
            className="input-field"
            value={formData.ante}
            onChange={(e) => update("ante", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-3">
        <StreetRow
          label="Pre-flop"
          streetData={formData.preFlop}
          onChange={(v) => update("preFlop", v)}
          showCards={false}
        />

        <StreetRow
          label="Flop"
          streetData={formData.flop}
          onChange={(v) => update("flop", v)}
        />

        <StreetRow
          label="Turn"
          streetData={formData.turn}
          onChange={(v) => update("turn", v)}
        />

        <StreetRow
          label="River"
          streetData={formData.river}
          onChange={(v) => update("river", v)}
        />

        <CardOpenRow
          entries={formData.cardOpen ?? createEmptyCardOpenData()}
          onChange={(v) => update("cardOpen", v)}
        />
      </div>

      <div className="pt-2">
        <label className="label-text">상황 설명</label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
          <textarea
            className="input-field min-h-0 flex-1 resize-none py-2.5"
            placeholder="기사에 반영하고 싶은 부가적인 상황 설명을 입력하세요."
            rows={1}
            value={formData.situationDescription ?? ""}
            onChange={(e) => update("situationDescription", e.target.value)}
          />
          <button
            type="button"
            onClick={onGenerate}
            disabled={isGenerating}
            className="btn-primary w-full shrink-0 sm:w-auto"
          >
            {isGenerating ? "기사 작성 중..." : "기사 작성"}
          </button>
        </div>
      </div>
    </section>
  );
}
