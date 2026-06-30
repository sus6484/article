"use client";

import { Hand } from "@/lib/types";

interface PlayTabsProps {
  hands: Hand[];
  activeHandId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
}

export default function PlayTabs({
  hands,
  activeHandId,
  onSelect,
  onAdd,
  onDelete,
}: PlayTabsProps) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-gray-200 bg-gray-50 lg:w-56 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-900">플레이 관리</h2>
        <button
          type="button"
          onClick={onAdd}
          className="flex h-7 w-7 items-center justify-center rounded-md bg-brand text-lg font-bold text-white transition-colors hover:bg-brand-hover"
          title="새 핸드 추가"
          aria-label="새 핸드 추가"
        >
          +
        </button>
      </div>

      <nav className="flex gap-1 overflow-x-auto p-2 lg:flex-col lg:overflow-x-visible">
        {hands.map((hand) => {
          const isActive = hand.id === activeHandId;
          const hasContent = hand.article.length > 0;

          return (
            <div key={hand.id} className="group flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => onSelect(hand.id)}
                className={`flex min-w-[100px] flex-1 items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors lg:min-w-0 ${
                  isActive
                    ? "bg-brand text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="truncate">{hand.name}</span>
                {hasContent && (
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                      isActive ? "bg-white" : "bg-brand"
                    }`}
                    title="기사 생성됨"
                  />
                )}
              </button>

              {hands.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(hand.id);
                  }}
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs transition-colors ${
                    isActive
                      ? "text-white/80 hover:bg-brand-hover hover:text-white"
                      : "text-gray-400 hover:bg-red-50 hover:text-red-500"
                  }`}
                  title="핸드 삭제"
                  aria-label={`${hand.name} 삭제`}
                >
                  ✕
                </button>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
