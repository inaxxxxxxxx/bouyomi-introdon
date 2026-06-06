import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "🎤 歌詞棒読みクイズ",
  description: "有名な楽曲の歌詞を棒読み音声で再生し、曲名を当てるクイズゲーム",
}

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-[#0f172a] text-white antialiased">{children}</body>
    </html>
  )
}
