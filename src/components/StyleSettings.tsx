"use client";

import { useState } from "react";
import {
  ArticleStyleConfig,
  DEFAULT_ARTICLE_STYLE,
  saveStyleConfig,
} from "@/lib/article-style";

interface StyleSettingsProps {
  styleConfig: ArticleStyleConfig;
  onChange: (config: ArticleStyleConfig) => void;
}

export default function StyleSettings({
  styleConfig,
  onChange,
}: StyleSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draftExample, setDraftExample] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const customActive = styleConfig.userCustomized ?? false;

  const handleAddExample = () => {
    const trimmed = draftExample.trim();
    if (!trimmed) return;

    const next: ArticleStyleConfig = {
      ...styleConfig,
      examples: [...styleConfig.examples, trimmed],
      userCustomized: true,
    };
    onChange(next);
    saveStyleConfig(next);
    setDraftExample("");
  };

  const handleRemoveExample = (index: number) => {
    const next: ArticleStyleConfig = {
      ...styleConfig,
      examples: styleConfig.examples.filter((_, i) => i !== index),
      userCustomized: true,
    };
    onChange(next);
    saveStyleConfig(next);
  };

  const handleAnalyze = async () => {
    const examples =
      draftExample.trim().length > 0
        ? [...styleConfig.examples, draftExample.trim()]
        : styleConfig.examples;

    if (examples.length === 0) {
      setAnalyzeError("예시 기사를 1개 이상 입력해 주세요.");
      return;
    }

    setIsAnalyzing(true);
    setAnalyzeError(null);

    try {
      const res = await fetch("/api/analyze-examples", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examples }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "예시 분석에 실패했습니다.");
      }

      const next: ArticleStyleConfig = {
        examples: data.examples,
        skeleton: data.skeleton,
        rules: data.rules,
        userCustomized: true,
      };
      onChange(next);
      saveStyleConfig(next);
      setDraftExample("");
      setShowPreview(true);
    } catch (err) {
      setAnalyzeError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    onChange(DEFAULT_ARTICLE_STYLE);
    saveStyleConfig(DEFAULT_ARTICLE_STYLE);
    setDraftExample("");
    setAnalyzeError(null);
    setShowPreview(false);
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div>
          <h2 className="text-sm font-semibold text-gray-900">기사 스타일 설정</h2>
          <p className="mt-0.5 text-xs text-gray-500">
            {customActive
              ? `맞춤 틀 적용 중 · 예시 ${styleConfig.examples.length}편`
              : `METIS 기본 스타일 적용 중 · 예시 ${styleConfig.examples.length}편`}
          </p>
        </div>
        <span className="text-gray-400">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="space-y-4 border-t border-gray-100 px-4 py-4">
          {styleConfig.examples.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-600">저장된 예시</p>
              {styleConfig.examples.map((ex, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2"
                >
                  <p className="flex-1 line-clamp-3 text-xs text-gray-700">
                    {ex}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleRemoveExample(i)}
                    className="shrink-0 text-xs text-red-500 hover:text-red-700"
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          )}

          <div>
            <label className="label-text">예시 기사 붙여넣기</label>
            <textarea
              className="input-field min-h-[160px] resize-y font-mono text-xs"
              placeholder="원하는 톤의 완성된 기사를 그대로 붙여넣으세요. 2~3편이면 더 정확합니다."
              value={draftExample}
              onChange={(e) => setDraftExample(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleAddExample}
              disabled={!draftExample.trim()}
              className="btn-secondary"
            >
              예시 추가
            </button>
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="btn-primary"
            >
              {isAnalyzing ? "틀 분석 중..." : "예시로 틀 만들기"}
            </button>
            {customActive && (
              <button type="button" onClick={handleReset} className="btn-secondary">
                기본 틀로 초기화
              </button>
            )}
          </div>

          {analyzeError && (
            <p className="text-xs text-red-600">{analyzeError}</p>
          )}

          {styleConfig.examples.length > 0 && (
            <div>
              <button
                type="button"
                onClick={() => setShowPreview((v) => !v)}
                className="text-xs font-medium text-brand hover:underline"
              >
                {showPreview ? "적용 중인 틀 숨기기" : "적용 중인 틀 보기"}
              </button>

              {showPreview && (
                <div className="mt-2 space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <div>
                    <p className="mb-1 text-xs font-semibold text-gray-600">출력 틀</p>
                    <pre className="whitespace-pre-wrap text-xs text-gray-700">
                      {styleConfig.skeleton}
                    </pre>
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-semibold text-gray-600">작성 규칙</p>
                    <pre className="whitespace-pre-wrap text-xs text-gray-700">
                      {styleConfig.rules}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
