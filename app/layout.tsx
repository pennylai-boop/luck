import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BNI Lucky Draw | 商務例會抽獎",
  description: "BNI 商務例會現場抽獎轉盤 — 純前端、關閉即重置",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
