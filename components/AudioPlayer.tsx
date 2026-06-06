"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface AudioPlayerProps {
  lyrics: string[]
  onLyricAdvance?: (index: number) => void
}

export default function AudioPlayer({ lyrics, onLyricAdvance }: AudioPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSpeechSupported, setIsSpeechSupported] = useState(true)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && !window.speechSynthesis) {
      setIsSpeechSupported(false)
    }
    return () => {
      if (typeof window !== "undefined") {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  // Reset when lyrics change (new song)
  useEffect(() => {
    setCurrentIndex(0)
    setIsPlaying(false)
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel()
    }
  }, [lyrics])

  const speak = useCallback(
    (index: number) => {
      if (!isSpeechSupported) return
      if (index >= lyrics.length) return

      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(lyrics[index])
      utterance.lang = "ja-JP"
      utterance.rate = 0.85
      utterance.pitch = 1.0
      utterance.volume = 1.0

      utterance.onstart = () => setIsPlaying(true)
      utterance.onend = () => {
        setIsPlaying(false)
        const next = index + 1
        setCurrentIndex(next)
        if (onLyricAdvance) onLyricAdvance(next)
      }
      utterance.onerror = () => setIsPlaying(false)

      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
    },
    [lyrics, isSpeechSupported, onLyricAdvance]
  )

  const handlePlay = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      return
    }
    speak(currentIndex)
  }

  const isFinished = currentIndex >= lyrics.length

  return (
    <div className="flex flex-col items-center gap-3">
      {!isSpeechSupported && (
        <p className="text-xs text-red-400">
          このブラウザは音声合成に対応していません
        </p>
      )}
      <button
        onClick={handlePlay}
        disabled={!isSpeechSupported || isFinished}
        className={`
          relative w-full max-w-xs px-6 py-4 rounded-full font-bold text-lg
          transition-all duration-200 active:scale-95
          ${
            isPlaying
              ? "bg-gray-700 text-white"
              : isFinished
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-[#e8003d] text-white hover:bg-[#c0002f]"
          }
        `}
      >
        {isPlaying ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-flex gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="inline-block w-1.5 h-5 bg-black rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </span>
            停止
          </span>
        ) : isFinished ? (
          "歌詞を全て再生しました"
        ) : (
          <span>
            ▶ 再生
            {currentIndex > 0 && (
              <span className="ml-2 text-sm opacity-70">
                ({currentIndex + 1}行目)
              </span>
            )}
          </span>
        )}
      </button>

      {/* Lyric progress dots */}
      <div className="flex gap-1.5">
        {lyrics.map((_, i) => (
          <div
            key={i}
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${i < currentIndex ? "bg-[#e8003d]" : i === currentIndex ? "bg-[#e8003d] animate-pulse" : "bg-gray-300"}
            `}
          />
        ))}
      </div>
    </div>
  )
}
