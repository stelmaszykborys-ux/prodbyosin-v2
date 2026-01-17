"use client"

import { useState, useEffect } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BeatCard } from "@/components/beat-card"
import Link from "next/link"
import type { Beat } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"

export function FeaturedBeats() {
  const [beats, setBeats] = useState<Beat[]>([])
  const [loading, setLoading] = useState(true)
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBeats() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("beats")
        .select("*")
        .eq("is_published", true)
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(4)

      if (!error && data) {
        setBeats(data)
      }
      setLoading(false)
    }
    fetchBeats()
  }, [])

  const handlePlay = (beat: Beat) => {
    setCurrentlyPlaying(currentlyPlaying === beat.id ? null : beat.id)
  }

  if (loading) {
    return (
      <section className="py-24 px-6 lg:px-12">
        <div className="container mx-auto max-w-7xl">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-secondary/50 rounded w-1/3" />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-secondary/50 rounded" />
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (beats.length === 0) {
    return null
  }

  return (
    <section className="py-24 px-6 lg:px-12 bg-gradient-to-b from-background via-secondary/5 to-background">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Najnowsza Produkcja</p>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-primary">Wyróżnione Beaty</h2>
          </div>
          <Link href="/sklep">
            <Button
              variant="outline"
              className="border-primary/30 text-primary hover:bg-primary/10 uppercase tracking-[0.15em] text-xs group bg-transparent"
            >
              Zobacz Wszystkie
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {beats.map((beat) => (
            <BeatCard key={beat.id} beat={beat} onPlay={handlePlay} isPlaying={currentlyPlaying === beat.id} />
          ))}
        </div>
      </div>
    </section>
  )
}
