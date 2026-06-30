"use client";

import { useCallback, useEffect, useState } from "react";
import PlayTabs from "@/components/PlayTabs";
import InputForm from "@/components/InputForm";
import OutputArea from "@/components/OutputArea";
import StyleSettings from "@/components/StyleSettings";
import {
  ArticleStyleConfig,
  loadStyleConfig,
  saveStyleConfig,
} from "@/lib/article-style";
import { loadHandsData, saveHandsData } from "@/lib/hands-storage";
import { normalizeHandFormChipFields } from "@/lib/chip-format";
import { createNewHand, Hand, HandFormData } from "@/lib/types";

export default function HomePage() {
  const [hands, setHands] = useState<Hand[]>(() => [createNewHand(1)]);
  const [activeHandId, setActiveHandId] = useState<string>("");
  const [hydrated, setHydrated] = useState(false);
  const [styleConfig, setStyleConfig] = useState<ArticleStyleConfig | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefreshingArticle, setIsRefreshingArticle] = useState(false);
  const [isRefreshingTitles, setIsRefreshingTitles] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { hands: savedHands, activeHandId: savedActiveHandId } =
      loadHandsData();
    setHands(savedHands);
    setActiveHandId(savedActiveHandId);
    setStyleConfig(loadStyleConfig());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || !activeHandId) return;
    saveHandsData(hands, activeHandId);
  }, [hands, activeHandId, hydrated]);

  const handleStyleChange = (config: ArticleStyleConfig) => {
    setStyleConfig(config);
    saveStyleConfig(config);
  };

  const activeHand = hands.find((h) => h.id === activeHandId) ?? hands[0];

  const updateActiveHand = useCallback(
    (updates: Partial<Hand>) => {
      setHands((prev) =>
        prev.map((h) => (h.id === activeHandId ? { ...h, ...updates } : h))
      );
    },
    [activeHandId]
  );

  const handleAddHand = () => {
    const newHand = createNewHand(hands.length + 1);
    setHands((prev) => [...prev, newHand]);
    setActiveHandId(newHand.id);
    setError(null);
  };

  const handleDeleteHand = (id: string) => {
    if (hands.length <= 1) return;

    const index = hands.findIndex((h) => h.id === id);
    const newHands = hands.filter((h) => h.id !== id);

    setHands(newHands);

    if (activeHandId === id) {
      const nextIndex = Math.min(index, newHands.length - 1);
      setActiveHandId(newHands[nextIndex].id);
    }
    setError(null);
  };

  const handleFormChange = (formData: HandFormData) => {
    updateActiveHand({ formData });
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    const normalizedFormData = normalizeHandFormChipFields(activeHand.formData);
    updateActiveHand({ formData: normalizedFormData });

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData: normalizedFormData,
          styleConfig: styleConfig ?? undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "기사 생성에 실패했습니다.");
      }

      updateActiveHand({
        formData: data.formData ?? normalizedFormData,
        article: data.article,
        shortsTitles: data.shortsTitles ?? [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyArticle = async () => {
    if (!activeHand.article) return;
    try {
      await navigator.clipboard.writeText(activeHand.article);
    } catch {
      setError("클립보드 복사에 실패했습니다.");
    }
  };

  const handleRefreshArticle = async (revisionNote: string) => {
    if (!activeHand.article) return;

    setIsRefreshingArticle(true);
    setError(null);

    const normalizedFormData = normalizeHandFormChipFields(activeHand.formData);
    updateActiveHand({ formData: normalizedFormData });

    try {
      const res = await fetch("/api/refresh-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData: normalizedFormData,
          article: activeHand.article,
          styleConfig: styleConfig ?? undefined,
          revisionNote,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "기사 재생성에 실패했습니다.");
      }

      updateActiveHand({
        formData: data.formData ?? normalizedFormData,
        article: data.article,
        shortsTitles: data.shortsTitles ?? [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsRefreshingArticle(false);
    }
  };

  const handleRefreshTitles = async (revisionNote: string) => {
    if (!activeHand.article) return;

    setIsRefreshingTitles(true);
    setError(null);

    try {
      const res = await fetch("/api/refresh-titles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          article: activeHand.article,
          formData: activeHand.formData,
          revisionNote,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "제목 생성에 실패했습니다.");
      }

      updateActiveHand({ shortsTitles: data.shortsTitles });
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsRefreshingTitles(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-xl font-bold text-gray-900">
          홀덤 기사 &amp; 쇼츠 제목 생성기
        </h1>
      </header>

      <div className="flex flex-1 flex-col lg:flex-row">
        <PlayTabs
          hands={hands}
          activeHandId={activeHandId}
          onSelect={setActiveHandId}
          onAdd={handleAddHand}
          onDelete={handleDeleteHand}
        />

        <main className="flex flex-1 flex-col gap-8 overflow-auto p-6 xl:flex-row">
          <div className="flex flex-1 flex-col gap-4 xl:max-w-xl">
            {styleConfig && (
              <StyleSettings
                styleConfig={styleConfig}
                onChange={handleStyleChange}
              />
            )}
            <InputForm
              formData={activeHand.formData}
              onChange={handleFormChange}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </div>

          <div className="hidden w-px bg-gray-200 xl:block" />

          <div className="flex-1">
            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <OutputArea
              article={activeHand.article}
              shortsTitles={activeHand.shortsTitles}
              onCopyArticle={handleCopyArticle}
              onRefreshArticle={handleRefreshArticle}
              onRefreshTitles={handleRefreshTitles}
              isRefreshingArticle={isRefreshingArticle}
              isRefreshingTitles={isRefreshingTitles}
              isGenerating={isGenerating}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
