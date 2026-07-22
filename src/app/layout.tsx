import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "어디로? | 랜덤 여행 게임",
  description: "다트, 슬롯, 카드로 오늘의 국내 여행지를 정해보세요.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
