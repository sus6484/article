import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "홀덤 기사 & 쇼츠 제목 생성기",
  description: "홀덤 토너먼트 미디어팀을 위한 기사 및 쇼츠 제목 자동 생성 도구",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
