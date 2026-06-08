"use client"

import { useState, useRef } from "react"
import { Song, GameState } from "@/types/song"
import { getRandomSong, checkAnswer } from "@/data/songs"
import { calcScore, renderTitleBlocks, renderDifficulty } from "@/lib/game"
import AudioPlayer from "./AudioPlayer"
import HintPanel from "./HintPanel"
import Confetti from "./Confetti"

const initialGameState: GameState = {
  status: "idle",
  currentSong: null,
  questionNumber: 0,
  score: 0,
  hintsUsed: 0,
  lyricsRevealed: 1,
  lyricsPlayed: 0,
  userAnswer: "",
  isCorrect: null,
  streak: 0,
  totalAnswered: 0,
  correctAnswered: 0,
}

// floating music note decorations
function FloatingNotes() {
  const notes = [
    { icon: "♪", top: "10%", left: "8%", delay: "0s", size: "text-2xl", color: "text-[#d80c18]/30" },
    { icon: "♫", top: "20%", left: "88%", delay: "1s", size: "text-3xl", color: "text-pink-300/40" },
    { icon: "♩", top: "60%", left: "5%", delay: "0.5s", size: "text-xl", color: "text-[#d80c18]/20" },
    { icon: "♬", top: "75%", left: "90%", delay: "1.5s", size: "text-2xl", color: "text-pink-400/30" },
    { icon: "♪", top: "45%", left: "93%", delay: "2s", size: "text-lg", color: "text-[#d80c18]/25" },
    { icon: "🎵", top: "85%", left: "12%", delay: "0.8s", size: "text-xl", color: "" },
  ]
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {notes.map((n, i) => (
        <span
          key={i}
          className={`absolute ${n.size} ${n.color} animate-float select-none`}
          style={{ top: n.top, left: n.left, animationDelay: n.delay }}
        >
          {n.icon}
        </span>
      ))}
    </div>
  )
}

export default function GameScreen() {
  const [game, setGame] = useState<GameState>(initialGameState)
  const [showConfetti, setShowConfetti] = useState(false)
  const answerInputRef = useRef<HTMLInputElement>(null)

  const handleNewQuestion = () => {
    const song = getRandomSong(game.currentSong?.id)
    setGame((prev) => ({
      ...prev,
      status: "playing",
      currentSong: song,
      questionNumber: prev.questionNumber + 1,
      hintsUsed: 0,
      lyricsRevealed: 1,
      lyricsPlayed: 0,
      userAnswer: "",
      isCorrect: null,
    }))
    setTimeout(() => answerInputRef.current?.focus(), 300)
  }

  const handlePass = () => {
    setGame((prev) => ({
      ...prev,
      status: "answered",
      isCorrect: false,
      isPassed: true,
      streak: 0,
      totalAnswered: prev.totalAnswered + 1,
    }))
  }

  const handleHint = () => {
    if (game.hintsUsed >= 5) return
    setGame((prev) => ({
      ...prev,
      hintsUsed: prev.hintsUsed + 1,
      lyricsRevealed: Math.min(prev.lyricsRevealed + 1, prev.currentSong?.lyrics.length ?? 5),
    }))
  }

  const handleAnswer = () => {
    if (!game.currentSong || !game.userAnswer.trim()) return
    const correct = checkAnswer(game.currentSong, game.userAnswer)
    const points = correct ? calcScore(game.hintsUsed) : 0

    if (correct) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }

    setGame((prev) => ({
      ...prev,
      status: "answered",
      isCorrect: correct,
      score: prev.score + points,
      streak: correct ? prev.streak + 1 : 0,
      totalAnswered: prev.totalAnswered + 1,
      correctAnswered: correct ? prev.correctAnswered + 1 : prev.correctAnswered,
    }))
  }

  const song = game.currentSong

  return (
    <div className={`min-h-screen ${game.status === "idle" ? "bg-[#d80c18]" : "bg-white"} text-[#1a1a1a] flex flex-col`}>
      <Confetti active={showConfetti} />
      <FloatingNotes />

      {/* Header */}
      <header className={`sticky top-0 z-50 bg-[#d80c18] px-4 py-0 ${game.status === "idle" ? "hidden" : "shadow-md"}`}>
        <div className="max-w-md mx-auto flex items-center justify-center">
          <button onClick={() => setGame({ ...initialGameState })} className="active:opacity-70 transition-opacity">
            <img src="/logo.png" alt="棒読みイントロドン" className="h-20 w-auto brightness-0 invert" />
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 py-5 max-w-md mx-auto w-full space-y-4 relative z-10">

        {/* ====== IDLE STATE ====== */}
        {game.status === "idle" && (
          <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8">

            {/* 浮遊する音符（白） */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
              {[
                { icon: "♪", top: "12%", left: "10%", delay: "0s", size: "text-3xl" },
                { icon: "♫", top: "25%", left: "85%", delay: "1s", size: "text-4xl" },
                { icon: "♩", top: "65%", left: "6%", delay: "0.5s", size: "text-2xl" },
                { icon: "♬", top: "72%", left: "88%", delay: "1.5s", size: "text-3xl" },
                { icon: "♪", top: "40%", left: "92%", delay: "2s", size: "text-xl" },
                { icon: "♫", top: "88%", left: "15%", delay: "0.8s", size: "text-2xl" },
              ].map((n, i) => (
                <span key={i} className={`absolute ${n.size} text-white/20 animate-float select-none`}
                  style={{ top: n.top, left: n.left, animationDelay: n.delay }}>
                  {n.icon}
                </span>
              ))}
            </div>

            {/* ロゴ */}
            <div className="relative z-10 flex flex-col items-center gap-8">
              <div className="relative">
                {/* ロゴ背後のぼんやり光 */}
                <div className="absolute inset-0 blur-3xl bg-white/10 rounded-full scale-110" />

                <img
                  src="/logo_sq.png"
                  alt="棒読みイントロドン"
                  className="relative w-full object-contain animate-logo-bounce-in"
                />
              </div>

              {/* スタートボタン */}
              <button
                onClick={handleNewQuestion}
                className="
                  w-64 py-4 rounded-full font-black text-xl
                  bg-white text-[#d80c18]
                  shadow-[0_4px_32px_rgba(0,0,0,0.2)]
                  hover:shadow-[0_4px_40px_rgba(0,0,0,0.3)]
                  active:scale-95 transition-all duration-200
                "
              >
                スタート
              </button>

              <p className="text-white text-xs">{25}曲収録中</p>
            </div>
          </div>
        )}

        {/* ====== PLAYING / ANSWERED STATE ====== */}
        {(game.status === "playing" || game.status === "answered") && song && (
          <>
            {/* Song meta card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-[#d80c18]/10 text-[#d80c18] text-xs font-bold border border-[#d80c18]/15">
                  🎵 {song.genre}
                </span>
                <span className="text-[#d80c18] text-sm tracking-widest">
                  {renderDifficulty(song.difficulty)}
                </span>
              </div>

              {/* Title blocks */}
              <div className="text-center py-3">
                <div className="text-xs text-gray-400 mb-2">曲名（{song.title.length}文字）</div>
                <div className="text-2xl font-mono tracking-[0.3em]">
                  {game.status === "answered" && game.isCorrect
                    ? <span className="text-[#d80c18] font-black animate-fade-in-scale inline-block">{song.title}</span>
                    : <span className="text-gray-200">{renderTitleBlocks(song.title)}</span>}
                </div>
              </div>
            </div>

            {/* Lyrics display */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-2 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">🎼</span>
                <span className="text-xs font-bold text-gray-400">歌詞</span>
              </div>
              {song.lyrics.slice(0, game.lyricsRevealed).map((_, i) => (
                <div
                  key={i}
                  className="py-3 px-4 rounded-xl bg-gray-50 border border-gray-100 text-sm flex items-start gap-2"
                  style={{ animation: `fadeIn 0.3s ease-out ${i * 0.08}s both` }}
                >
                  <span className="text-[#d80c18]/40 text-xs mt-0.5 shrink-0">♪</span>
                  {i < game.lyricsPlayed
                    ? <span className="text-[#1a1a1a]">{song.lyrics[i]}</span>
                    : <span className="text-gray-300 tracking-widest">？？？？？？？？？？？？</span>
                  }
                </div>
              ))}
              {game.lyricsRevealed < song.lyrics.length && game.status === "playing" && (
                <div className="text-center text-xs text-gray-400 pt-2 flex items-center justify-center gap-1">
                  <span className="animate-bounce inline-block">▼</span>
                  再生ボタンで次の歌詞へ
                </div>
              )}
            </div>

            {/* Audio player */}
            {game.status === "playing" && (
              <AudioPlayer
                lyrics={song.lyrics}
                onLyricAdvance={(idx) => {
                  setGame((prev) => ({
                    ...prev,
                    lyricsPlayed: idx,
                    lyricsRevealed: Math.min(idx + 1, song.lyrics.length),
                  }))
                }}
              />
            )}

            {/* Answer area */}
            {game.status === "playing" && (
              <div className="space-y-3">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🎵</span>
                  <input
                    ref={answerInputRef}
                    type="text"
                    value={game.userAnswer}
                    onChange={(e) =>
                      setGame((prev) => ({ ...prev, userAnswer: e.target.value }))
                    }
                    onKeyDown={(e) => e.key === "Enter" && handleAnswer()}
                    placeholder="曲名を入力..."
                    className="
                      w-full pl-10 pr-4 py-3 rounded-xl
                      bg-white border border-gray-200
                      text-[#1a1a1a] placeholder-gray-400
                      focus:outline-none focus:border-[#d80c18] focus:ring-2 focus:ring-[#d80c18]/15
                      text-base transition-all duration-150
                      shadow-[0_2px_8px_rgba(0,0,0,0.04)]
                    "
                  />
                </div>
                <button
                  onClick={handleAnswer}
                  disabled={!game.userAnswer.trim()}
                  className="
                    w-full py-3 rounded-full font-black text-base
                    bg-[#d80c18] text-white
                    shadow-[0_2px_12px_rgba(232,0,61,0.25)]
                    disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none
                    hover:bg-[#c0002f] hover:shadow-[0_2px_16px_rgba(232,0,61,0.35)]
                    active:scale-95 transition-all duration-150
                  "
                >
                  ✅ 回答する
                </button>
                <button
                  onClick={handlePass}
                  className="
                    w-full py-3 rounded-full font-black text-base
                    bg-white border border-gray-200 text-gray-400
                    shadow-[0_2px_8px_rgba(0,0,0,0.04)]
                    hover:bg-gray-50
                    active:scale-95 transition-all duration-150
                  "
                >
                  パス（わからない）
                </button>
              </div>
            )}


            {/* Result */}
            {game.status === "answered" && (
              <ResultPanel
                isCorrect={game.isCorrect}
                isPassed={(game as any).isPassed ?? false}
                song={song}
                hintsUsed={game.hintsUsed}
                onNext={handleNewQuestion}
              />
            )}
          </>
        )}
      </main>

      <footer className="text-center py-3 text-xs text-gray-400">
        ©みねた
      </footer>
    </div>
  )
}

function ResultPanel({
  isCorrect,
  isPassed,
  song,
  hintsUsed,
  onNext,
}: {
  isCorrect: boolean | null
  isPassed: boolean
  song: Song
  hintsUsed: number
  onNext: () => void
}) {
  const points = isCorrect ? calcScore(hintsUsed) : 0

  return (
    <div
      className={`
        rounded-2xl border p-5 space-y-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)]
        ${isCorrect
          ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
          : "bg-white border-gray-100"}
        animate-fade-in-scale
      `}
    >
      {/* Result */}
      <div className="text-center space-y-2">
        {isCorrect ? (
          <>
            <div className="text-6xl">🎉</div>
            <div className="flex justify-center gap-1 text-2xl">
              {["✨", "🌟", "✨"].map((s, i) => (
                <span key={i} className="animate-float" style={{ animationDelay: `${i * 0.2}s` }}>{s}</span>
              ))}
            </div>
          </>
        ) : isPassed ? null : (
          <div className="text-6xl">😢</div>
        )}
      </div>

      {/* Correct answer */}
      <div className="bg-white rounded-xl p-4 space-y-1 border border-gray-100 shadow-sm">
        <div className="text-gray-400 text-xs font-bold">🎵 正解の曲</div>
        <div className="font-black text-[#1a1a1a] text-lg">{song.title}</div>
        <div className="text-gray-500 text-sm">{song.artist} / {song.year}年</div>
      </div>

      {/* Next button */}
      <button
        onClick={onNext}
        className="
          w-full py-4 rounded-full font-black text-lg
          bg-[#d80c18] text-white
          shadow-[0_4px_20px_rgba(232,0,61,0.4)]
          hover:bg-[#c0002f] hover:shadow-[0_4px_28px_rgba(232,0,61,0.6)]
          active:scale-95 transition-all duration-150
        "
      >
        🎲 次の問題へ
      </button>
    </div>
  )
}
