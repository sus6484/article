"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface OutputAreaProps {
  article: string;
  shortsTitles: string[];
  onCopyArticle: () => void;
  onRefreshArticle: (revisionNote: string) => void;
  onRefreshTitles: () => void;
  isRefreshingArticle: boolean;
  isRefreshingTitles: boolean;
  isGenerating: boolean;
}

export default function OutputArea({
  article,
  shortsTitles,
  onCopyArticle,
  onRefreshArticle,
  onRefreshTitles,
  isRefreshingArticle,
  isRefreshingTitles,
  isGenerating,
}: OutputAreaProps) {
  const [copied, setCopied] = useState(false);
  const [revisionNote, setRevisionNote] = useState("");

  const handleCopy = async () => {
    onCopyArticle();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="space-y-6">
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-gray-900">생성 결과</h2>
          {article && (
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={revisionNote}
                onChange={(e) => setRevisionNote(e.target.value)}
                placeholder="수정 요구사항 (선택)"
                disabled={isRefreshingArticle}
                className="input-field w-44 py-1.5 text-xs sm:w-52"
              />
              <button
                type="button"
                onClick={() => onRefreshArticle(revisionNote)}
                disabled={isRefreshingArticle}
                className="btn-secondary"
              >
                {isRefreshingArticle ? "생성 중..." : "기사 새로고침"}
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="btn-secondary"
              >
                {copied ? "복사 완료!" : "기사 복사"}
              </button>
            </div>
          )}
        </div>

        <div className="min-h-[200px] rounded-lg border border-gray-200 bg-white p-5">
          {isGenerating || isRefreshingArticle ? (
            <div className="flex h-40 items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
                <p className="text-sm text-gray-500">기사를 작성하고 있습니다...</p>
              </div>
            </div>
          ) : article ? (
            <article className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-li:text-gray-700">
              <ReactMarkdown>{article}</ReactMarkdown>
            </article>
          ) : (
            <div className="flex h-40 items-center justify-center">
              <p className="text-sm text-gray-400">
                핸드 정보를 입력하고 [기사 작성] 버튼을 눌러 주세요.
              </p>
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base font-bold text-gray-900">쇼츠 제목 추천</h3>
          {article && (
            <button
              type="button"
              onClick={onRefreshTitles}
              disabled={isRefreshingTitles}
              className="btn-secondary"
            >
              {isRefreshingTitles ? "생성 중..." : "제목 새로고침"}
            </button>
          )}
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5">
          {isRefreshingTitles ? (
            <div className="flex h-24 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />
            </div>
          ) : shortsTitles.length > 0 ? (
            <ol className="space-y-3">
              {shortsTitles.map((title, index) => (
                <li
                  key={`${index}-${title}`}
                  className="flex gap-3 rounded-lg border border-brand/20 bg-brand-light/30 px-4 py-3"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-800">{title}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="py-6 text-center text-sm text-gray-400">
              기사 작성 후 쇼츠 제목이 여기에 표시됩니다.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
