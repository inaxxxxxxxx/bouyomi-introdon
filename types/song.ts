export interface Song {
  id: number
  title: string
  artist: string
  genre: string
  difficulty: number
  year: number
  lyrics: string[]
  hints: {
    artistInitial: string
    year: string
  }
}

export interface GameState {
  status: "idle" | "playing" | "answered" | "revealed"
  currentSong: Song | null
  questionNumber: number
  score: number
  hintsUsed: number
  lyricsRevealed: number
  userAnswer: string
  isCorrect: boolean | null
  streak: number
  totalAnswered: number
  correctAnswered: number
  lyricsPlayed: number
}
