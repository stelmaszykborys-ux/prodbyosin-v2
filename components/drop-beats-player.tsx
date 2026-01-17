"use client"

import { useState } from "react"
import type { Drop, DropBeat, Beat } from "@/lib/types"
import Image from "next/image"
import { Play, Pause, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react"
import { useCart } from "@/hooks/use-cart"

interface DropBeatsPlayerProps {
  drop: Drop
  beatsData: DropBeat[] | any[]
}

export function DropBeatsPlayer({ drop, beatsData }: DropBeatsPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedLicense, setSelectedLicense] = useState<"mp3" | "wav" | "stems">("mp3")
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null)
  const { addToCart } = useCart()

  const beats = beatsData.map((item: any) => item.beat || item)
  const currentBeat = beats[currentIndex] as Beat | null

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % beats.length)
    setIsPlaying(true)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + beats.length) % beats.length)
    setIsPlaying(true)
  }

  const handlePlay = () => {
    if (audioRef) {
      if (isPlaying) {
        audioRef.pause()
      } else {
        audioRef.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleAddToCart = (beat: Beat) => {
    const prices: Record<"mp3" | "wav" | "stems", number> = {
      mp3: beat.price_mp3,
      wav: beat.price_wav,
      stems: beat.price_stems,
    }

    addToCart({
      beat_id: beat.id,
      license_type: selectedLicense,
      price: prices[selectedLicense],
    })
  }

  if (!currentBeat || beats.length === 0) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-light text-primary">Brak beatów w tym drop'ie</h1>
        </div>
      </section>
    )
  }

  const bgColor = drop.background_color || "#0a0a0a"

  return (
    <section
      className="relative min-h-screen w-full flex items-center justify-center py-20"
      style={{
        backgroundColor: bgColor,
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {drop.background_image_url && (
          <Image
            src={drop.background_image_url || "/placeholder.svg"}
            alt={drop.title}
            fill
            className="object-cover"
            quality={90}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-6 lg:px-12 w-full">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h1 className="font-serif text-5xl md:text-6xl font-light text-primary">{drop.title}</h1>
            <p className="text-muted-foreground">
              {currentIndex + 1} z {beats.length} beatów
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Beat cover */}
            <div className="flex items-center justify-center">
              <div className="relative w-full aspect-square rounded-sm overflow-hidden border border-border/50 bg-gradient-to-br from-secondary to-muted">
                {currentBeat.cover_image_url && (
                  <Image
                    src={currentBeat.cover_image_url || "/placeholder.svg"}
                    alt={currentBeat.title}
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end p-6">
                  <div>
                    <h2 className="font-serif text-4xl font-light text-primary">{currentBeat.title}</h2>
                    <p className="text-muted-foreground mt-2">
                      {currentBeat.bpm} BPM • {currentBeat.key} • {currentBeat.genre}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Audio player */}
              <audio
                ref={setAudioRef}
                src={currentBeat.audio_preview_url || ""}
                autoPlay={isPlaying}
                onEnded={() => setIsPlaying(false)}
              />

              {/* Description */}
              {currentBeat.description && (
                <p className="text-muted-foreground text-lg leading-relaxed">{currentBeat.description}</p>
              )}

              {/* License selector */}
              <div className="space-y-3">
                <p className="text-sm uppercase tracking-wider text-muted-foreground">Wybierz licencję</p>
                <div className="grid grid-cols-3 gap-3">
                  {(["mp3", "wav", "stems"] as const).map((license) => (
                    <button
                      key={license}
                      onClick={() => setSelectedLicense(license)}
                      className={`p-4 rounded-sm border transition-colors ${
                        selectedLicense === license
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/50 bg-card/30 text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      <p className="uppercase text-xs font-semibold tracking-wider">{license}</p>
                      <p className="text-xs mt-2">
                        {license === "mp3"
                          ? `${currentBeat.price_mp3 / 100} zł`
                          : license === "wav"
                            ? `${currentBeat.price_wav / 100} zł`
                            : `${currentBeat.price_stems / 100} zł`}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Play controls */}
              <div className="flex gap-4 items-center">
                <button
                  onClick={handlePlay}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 py-4 rounded-sm flex items-center justify-center gap-2 transition-colors"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  <span className="uppercase text-xs tracking-wider font-semibold">
                    {isPlaying ? "Wstrzymaj" : "Odtwórz"}
                  </span>
                </button>
              </div>

              {/* Add to cart button */}
              <button
                onClick={() => handleAddToCart(currentBeat)}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 py-4 rounded-sm flex items-center justify-center gap-2 transition-colors uppercase text-xs tracking-wider font-semibold"
              >
                <ShoppingCart className="w-5 h-5" />
                Dodaj do koszyka
              </button>

              {/* Navigation */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handlePrev}
                  className="flex-1 border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/50 py-3 rounded-sm flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="uppercase text-xs tracking-wider ml-2">Poprzedni</span>
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/50 py-3 rounded-sm flex items-center justify-center transition-colors"
                >
                  <span className="uppercase text-xs tracking-wider mr-2">Następny</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Package description and sample previews */}
          <div className="border-t border-border/50 pt-12 space-y-8">
            {drop.description && (
              <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
                {drop.description}
              </p>
            )}
            <h3 className="text-2xl font-serif font-light text-primary">Zawartość paczki</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {beats.map((beat: Beat, idx: number) => (
                <div
                  key={beat.id}
                  className={`space-y-2 p-4 rounded-sm transition-colors cursor-pointer ${
                    idx === currentIndex ? "bg-primary/10 border border-primary/30" : "bg-card/30 border border-border/50 hover:border-primary/50"
                  }`}
                  onClick={() => setCurrentIndex(idx)}
                >
                  <p className="font-serif text-xl text-primary truncate">{beat.title}</p>
                  <audio
                    controls
                    src={beat.audio_preview_url || ""}
                    className="w-full"
                    preload="none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
