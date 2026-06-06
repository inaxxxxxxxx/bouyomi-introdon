"use client"

import { useEffect, useState } from "react"

interface Particle {
  id: number
  x: number
  color: string
  delay: number
  duration: number
  size: number
}

export default function Confetti({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (!active) {
      setParticles([])
      return
    }
    const colors = ["#22d3ee", "#22c55e", "#f59e0b", "#ec4899", "#a78bfa", "#f97316"]
    const newParticles: Particle[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
      duration: 1.5 + Math.random() * 1,
      size: 6 + Math.random() * 8,
    }))
    setParticles(newParticles)

    const timer = setTimeout(() => setParticles([]), 3000)
    return () => clearTimeout(timer)
  }, [active])

  if (!particles.length) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute top-0 rounded-sm"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            animation: `confettiFall ${p.duration}s ${p.delay}s ease-in forwards`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  )
}
