"use client"

import { Song } from "@/types/song"

interface HintPanelProps {
  song: Song
  hintsUsed: number
  onUseHint: () => void
  lyricsRevealedCount: number
}

export default function HintPanel({
  song,
  hintsUsed,
  onUseHint,
  lyricsRevealedCount,
}: HintPanelProps) {
  const maxHints = 5
  const isRevealed = hintsUsed >= maxHints

  const getHintLabel = () => {
    if (isRevealed) return "ヒント使い切り"
    const next = hintsUsed + 1
    if (next === 1 || next === 2) return "歌詞を1行追加表示"
    if (next === 3) return "アーティストの頭文字"
    if (next === 4) return "発売年"
    if (next === 5) return "正解を表示"
    return ""
  }

  return (
    <div className="w-full space-y-3">
      <button
        onClick={onUseHint}
        disabled={isRevealed}
        className={`
          w-full py-3 rounded-full font-black text-base
          transition-all duration-200 active:scale-95 border
          shadow-[0_2px_8px_rgba(0,0,0,0.04)]
          ${
            isRevealed
              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
              : "bg-white text-yellow-600 border-yellow-300 hover:bg-yellow-50"
          }
        `}
      >
        {isRevealed ? "ヒント使い切り" : `💡 ヒント（${getHintLabel()}）`}
      </button>

      {hintsUsed > 0 && (
        <div className="space-y-2">
          {hintsUsed >= 1 && song.lyrics[2] && (
            <HintCard label="ヒント歌詞①" color="blue">
              {song.lyrics[2]}
            </HintCard>
          )}
          {hintsUsed >= 2 && song.lyrics[3] && (
            <HintCard label="ヒント歌詞②" color="blue">
              {song.lyrics[3]}
            </HintCard>
          )}
          {hintsUsed >= 3 && (
            <HintCard label="アーティスト頭文字" color="purple">
              {song.hints.artistInitial}
            </HintCard>
          )}
          {hintsUsed >= 4 && (
            <HintCard label="発売年" color="orange">
              {song.hints.year}
            </HintCard>
          )}
          {hintsUsed >= 5 && (
            <HintCard label="正解" color="green">
              {song.title}
            </HintCard>
          )}
        </div>
      )}

      {hintsUsed > 0 && hintsUsed < 5 && (
        <p className="text-xs text-center text-gray-400">
          ヒント{hintsUsed}回使用 → 獲得スコア:{" "}
          <span className="text-[#d80c18] font-bold">
            {hintsUsed === 1 ? 70 : hintsUsed === 2 ? 50 : hintsUsed === 3 ? 30 : 10}pt
          </span>
        </p>
      )}
    </div>
  )
}

function HintCard({
  label,
  color,
  children,
}: {
  label: string
  color: "blue" | "purple" | "orange" | "green"
  children: React.ReactNode
}) {
  const colorMap = {
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    purple: "border-purple-200 bg-purple-50 text-purple-700",
    orange: "border-orange-200 bg-orange-50 text-orange-700",
    green: "border-green-200 bg-green-50 text-green-700",
  }

  return (
    <div
      className={`
        rounded-xl border px-4 py-3
        ${colorMap[color]}
        animate-[fadeIn_0.3s_ease-out]
      `}
    >
      <div className="text-xs opacity-60 mb-1">{label}</div>
      <div className="font-semibold">{children}</div>
    </div>
  )
}
