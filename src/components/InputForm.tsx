"use client";

import { HandFormData } from "@/lib/types";

interface InputFormProps {
  formData: HandFormData;
  onChange: (data: HandFormData) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

function StreetRow({
  label,
  cardsValue,
  cardsPlaceholder,
  actionValue,
  actionPlaceholder,
  showAction = true,
  onCardsChange,
  onActionChange,
}: {
  label: string;
  cardsValue: string;
  cardsPlaceholder: string;
  actionValue: string;
  actionPlaceholder: string;
  showAction?: boolean;
  onCardsChange: (v: string) => void;
  onActionChange: (v: string) => void;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-brand">
        {label}
      </span>
      <div className={`grid gap-2 ${showAction ? "sm:grid-cols-2" : ""}`}>
        <div>
          <label className="mb-1 block text-xs text-gray-500">카드</label>
          <input
            type="text"
            className="input-field"
            placeholder={cardsPlaceholder}
            value={cardsValue}
            onChange={(e) => onCardsChange(e.target.value)}
          />
        </div>
        {showAction && (
          <div>
            <label className="mb-1 block text-xs text-gray-500">
              액션 <span className="text-gray-400">(선택)</span>
            </label>
            <input
              type="text"
              className="input-field"
              placeholder={actionPlaceholder}
              value={actionValue}
              onChange={(e) => onActionChange(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function InputForm({
  formData,
  onChange,
  onGenerate,
  isGenerating,
}: InputFormProps) {
  const update = (field: keyof HandFormData, value: string) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <section className="space-y-5">
      <div>
        <h2 className="mb-4 text-lg font-bold text-gray-900">핸드 정보 입력</h2>
        <p className="text-sm text-gray-500">
          토너먼트 핸드 데이터를 입력하고 기사를 생성하세요.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label-text">대회명</label>
          <input
            type="text"
            className="input-field"
            placeholder="예: METIS CLOSER in DAEGU (2026.05.25)"
            value={formData.tournamentName}
            onChange={(e) => update("tournamentName", e.target.value)}
          />
        </div>

        <div>
          <label className="label-text">남은 인원</label>
          <input
            type="number"
            min="1"
            className="input-field"
            placeholder="예: 8"
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
            placeholder="예: 8"
            value={formData.totalPlayers}
            onChange={(e) => update("totalPlayers", e.target.value)}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="label-text">블라인드 / 엔티</label>
          <input
            type="text"
            className="input-field"
            placeholder="예: Blinds 50k/100k, Ante 100k"
            value={formData.blindsAnte}
            onChange={(e) => update("blindsAnte", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="label-text">Pre-flop</label>
        <textarea
          className="input-field min-h-[80px] resize-y"
          placeholder="예: UTG 조규목 52만 올인, BTN 이기관 130만 올인"
          value={formData.preFlop}
          onChange={(e) => update("preFlop", e.target.value)}
          rows={3}
        />
      </div>

      <div>
        <label className="label-text">Hole Cards</label>
        <input
          type="text"
          className="input-field"
          placeholder="예: UTG Jh 8h, BTN Ac Kc"
          value={formData.holeCards}
          onChange={(e) => update("holeCards", e.target.value)}
        />
      </div>

      <div className="space-y-3">
        <StreetRow
          label="Flop"
          cardsValue={formData.flopCards}
          cardsPlaceholder="예: 4s Jd Ad"
          actionValue={formData.flopAction}
          actionPlaceholder="예: UTG 체크, BTN 50만 벳"
          onCardsChange={(v) => update("flopCards", v)}
          onActionChange={(v) => update("flopAction", v)}
        />

        <StreetRow
          label="Turn"
          cardsValue={formData.turnCards}
          cardsPlaceholder="예: Ks"
          actionValue={formData.turnAction}
          actionPlaceholder="예: BTN 100만 벳"
          onCardsChange={(v) => update("turnCards", v)}
          onActionChange={(v) => update("turnAction", v)}
        />

        <StreetRow
          label="River"
          cardsValue={formData.riverCards}
          cardsPlaceholder="예: Qd"
          actionValue=""
          actionPlaceholder=""
          showAction={false}
          onCardsChange={(v) => update("riverCards", v)}
          onActionChange={() => {}}
        />
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating}
          className="btn-primary w-full sm:w-auto"
        >
          {isGenerating ? "기사 작성 중..." : "기사 작성"}
        </button>
      </div>
    </section>
  );
}
