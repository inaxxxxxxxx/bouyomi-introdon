import { Song } from "@/types/song"

export const SCORE_TABLE: Record<number, number> = {
  0: 100,
  1: 70,
  2: 50,
  3: 30,
}

export function calcScore(hintsUsed: number): number {
  return SCORE_TABLE[hintsUsed] ?? 10
}

export function renderTitleBlocks(title: string): string {
  return title
    .split("")
    .map(() => "□")
    .join("")
}

export function renderDifficulty(level: number): string {
  return "★".repeat(level) + "☆".repeat(5 - level)
}

export function getHintContent(
  song: Song,
  hintStep: number
): { type: "lyrics" | "initial" | "year" | "reveal"; content: string } | null {
  // step 1,2 → extra lyrics (lyrics[hintStep+1] など)
  if (hintStep === 1) {
    return { type: "lyrics", content: song.lyrics[2] ?? "" }
  }
  if (hintStep === 2) {
    return { type: "lyrics", content: song.lyrics[3] ?? "" }
  }
  if (hintStep === 3) {
    return { type: "initial", content: song.hints.artistInitial }
  }
  if (hintStep === 4) {
    return { type: "year", content: song.hints.year }
  }
  if (hintStep >= 5) {
    return { type: "reveal", content: song.title }
  }
  return null
}
