import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "棒読みイントロドン",
  description: "有名な歌詞を感情ゼロで読み上げます。何の曲か当ててみよう！",
  openGraph: {
    title: "棒読みイントロドン",
    description: "有名な歌詞を感情ゼロで読み上げます。何の曲か当ててみよう！",
    images: [
      {
        url: "/ogp.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "棒読みイントロドン",
    description: "有名な歌詞を感情ゼロで読み上げます。何の曲か当ててみよう！",
    images: ["/ogp.png"],
  },
  icons: {
    apple: "/logo_sq.png",
    icon: "/logo_sq.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "棒読みイントロドン",
  },
}

export const viewport: Viewport = {
  themeColor: "#d80c18",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-white text-[#1a1a1a] antialiased">{children}</body>
    </html>
  )
}
