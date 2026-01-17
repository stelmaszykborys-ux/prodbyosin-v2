"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const GENRES = ["Trap", "Boom Bap", "Drill", "Pop Rap", "Synth Trap", "R&B"]
const MOODS = ["Melancholijny", "Energiczny", "Agresywny", "Pozytywny", "Nostalgiczny", "Futurystyczny"]
const BPM_RANGES = [
  { label: "Wolne (60-90)", min: 60, max: 90 },
  { label: "Średnie (90-120)", min: 90, max: 120 },
  { label: "Szybkie (120-150)", min: 120, max: 150 },
  { label: "Bardzo szybkie (150+)", min: 150, max: 300 },
]

export function BeatsFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentGenre = searchParams.get("genre")
  const currentMood = searchParams.get("mood")
  const currentBpmMin = searchParams.get("bpm_min")

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/sklep?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("/sklep")
  }

  const hasFilters = currentGenre || currentMood || currentBpmMin

  return (
    <div className="sticky top-28 space-y-8 bg-card/30 backdrop-blur-sm border border-border/50 rounded-sm p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xs uppercase tracking-[0.2em] text-primary">Filtry</h3>
        {hasFilters && (
          <button onClick={clearFilters} className="text-xs text-muted-foreground hover:text-primary transition-colors">
            Wyczyść
          </button>
        )}
      </div>

      {/* Genre */}
      <div className="space-y-3">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Gatunek</Label>
        <div className="flex flex-wrap gap-2">
          {GENRES.map((genre) => (
            <Button
              key={genre}
              variant={currentGenre === genre ? "default" : "outline"}
              size="sm"
              className="text-xs"
              onClick={() => updateFilter("genre", currentGenre === genre ? null : genre)}
            >
              {genre}
            </Button>
          ))}
        </div>
      </div>

      {/* Mood */}
      <div className="space-y-3">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Nastrój</Label>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((mood) => (
            <Button
              key={mood}
              variant={currentMood === mood ? "default" : "outline"}
              size="sm"
              className="text-xs"
              onClick={() => updateFilter("mood", currentMood === mood ? null : mood)}
            >
              {mood}
            </Button>
          ))}
        </div>
      </div>

      {/* BPM */}
      <div className="space-y-3">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Tempo (BPM)</Label>
        <div className="flex flex-col gap-2">
          {BPM_RANGES.map((range) => (
            <Button
              key={range.label}
              variant={currentBpmMin === String(range.min) ? "default" : "outline"}
              size="sm"
              className="text-xs justify-start"
              onClick={() => updateFilter("bpm_min", currentBpmMin === String(range.min) ? null : String(range.min))}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
