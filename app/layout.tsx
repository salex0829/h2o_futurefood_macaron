import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "色のないマカロン",
  description:
    "マカロンを食べたときに立ち上がる香りの体験を、色・形・名前で記録する官能評価ツール",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
