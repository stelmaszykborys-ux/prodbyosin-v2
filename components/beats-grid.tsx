"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { BeatCard } from "@/components/beat-card"
import type { Beat } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { useAudioPlayer } from "@/hooks/use-audio-player"

interface BeatsGridProps {
  initialBeats?: Beat[]
}

export function BeatsGrid({ initialBeats = [] }: BeatsGridProps) {
  const [beats, setBeats] = useState<Beat[]>(initialBeats)
  const [loading, setLoading] = useState(initialBeats.length === 0)
  const { currentlyPlaying, isPlaying, togglePlay } = useAudioPlayer()
  const searchParams = useSearchParams()

  const genre = searchParams.get("genre")
  const mood = searchParams.get("mood")
  const bpmMin = searchParams.get("bpm_min")
  const bpmMax = searchParams.get("bpm_max")

  useEffect(() => {
    async function fetchBeats() {
      // If we have initial beats and no filters are active, skip fetch
      if (!genre && !mood && !bpmMin && !bpmMax && initialBeats.length > 0) {
        setLoading(false)
        return
      }

      setLoading(true)
      const supabase = createClient()

      let query = supabase.from("beats").select("*").eq("is_published", true).order("created_at", { ascending: false })

      if (genre) {
        query = query.eq("genre", genre)
      }
      if (mood) {
        query = query.eq("mood", mood)
      }
      if (bpmMin) {
        query = query.gte("bpm", Number.parseInt(bpmMin))
      }
      if (bpmMax) {
        query = query.lte("bpm", Number.parseInt(bpmMax))
      }

      const { data, error } = await query

      if (!error && data) {
        setBeats(data)
      }
      setLoading(false)
    }

    fetchBeats()
  }, [genre, mood, bpmMin, bpmMax])

  const handlePlay = (beat: Beat) => {
    togglePlay(beat)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="aspect-square bg-card/50 animate-pulse rounded" />
        ))}
      </div>
    )
  }

  if (beats.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Nie znaleziono beatów spełniających kryteria.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {beats.map((beat) => (
        <BeatCard
          key={beat.id}
          beat={beat}
          onPlay={handlePlay}
          isPlaying={currentlyPlaying?.id === beat.id && isPlaying}
        />
      ))}
    </div>
  )
}
