"use client"

interface ScoreBoardProps {
  score: number
  questionNumber: number
  streak: number
  totalAnswered: number
  correctAnswered: number
}

export default function ScoreBoard({
  score,
  questionNumber,
  streak,
  totalAnswered,
  correctAnswered,
}: ScoreBoardProps) {
  const accuracy =
    totalAnswered > 0 ? Math.round((correctAnswered / totalAnswered) * 100) : 0

  return (
    <div className="grid grid-cols-3 gap-2 w-full">
      <div className="bg-white border border-gray-200 rounded-xl p-3 text-center shadow-sm">
        <div className="text-xs text-gray-400 mb-1">スコア</div>
        <div className="text-xl font-black text-[#d80c18] tabular-nums">
          {score.toLocaleString()}
          <span className="text-xs font-normal text-gray-400">pt</span>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-3 text-center shadow-sm">
        <div className="text-xs text-gray-400 mb-1">問題数</div>
        <div className="text-xl font-black text-[#1a1a1a] tabular-nums">
          第<span className="text-[#d80c18]">{questionNumber}</span>問
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-3 text-center shadow-sm">
        <div className="text-xs text-gray-400 mb-1">正解率</div>
        <div className="text-xl font-black text-[#1a1a1a] tabular-nums">
          <span className={accuracy >= 70 ? "text-green-500" : accuracy >= 40 ? "text-yellow-500" : "text-[#d80c18]"}>
            {accuracy}
          </span>
          <span className="text-xs font-normal text-gray-400">%</span>
        </div>
      </div>

      {streak >= 2 && (
        <div className="col-span-3 bg-[#d80c18]/5 border border-[#d80c18]/20 rounded-xl px-4 py-2 text-center">
          <span className="text-[#d80c18] font-bold">
            {streak}連勝中🔥
          </span>
        </div>
      )}
    </div>
  )
}
