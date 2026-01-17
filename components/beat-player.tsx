"use client"

import { useState } from "react"
import { Play, Pause, SkipForward, SkipBack } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const beats = [
  { id: 1, title: "Dark Nights", bpm: 140, key: "Am", duration: "3:24" },
  { id: 2, title: "City Lights", bpm: 128, key: "Cm", duration: "2:58" },
  { id: 3, title: "Midnight Drive", bpm: 135, key: "Gm", duration: "3:12" },
  { id: 4, title: "Urban Dreams", bpm: 145, key: "Dm", duration: "3:45" },
  { id: 5, title: "Lost in Sound", bpm: 130, key: "Em", duration: "3:01" },
]

export function BeatPlayer() {
  const [currentBeat, setCurrentBeat] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleNext = () => {
    setCurrentBeat((prev) => (prev + 1) % beats.length)
  }

  const handlePrevious = () => {
    setCurrentBeat((prev) => (prev - 1 + beats.length) % beats.length)
  }

  return (
    <section id="beaty" className="py-24 px-4 bg-gradient-to-b from-background via-secondary/20 to-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="font-serif text-5xl md:text-6xl font-light text-primary mb-4">Odsłuchaj Beaty</h2>
          <p className="text-muted-foreground uppercase tracking-wider text-sm">Najnowsza produkcja</p>
        </div>

        {/* Main Player */}
        <Card className="bg-card/50 backdrop-blur-sm border-border p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Album Art Placeholder */}
            <div className="w-48 h-48 bg-gradient-to-br from-secondary to-muted rounded flex items-center justify-center flex-shrink-0">
              <span className="font-serif text-6xl text-primary">O</span>
            </div>

            <div className="flex-1 w-full">
              <div className="mb-6">
                <h3 className="font-serif text-3xl text-primary mb-2">{beats[currentBeat].title}</h3>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>{beats[currentBeat].bpm} BPM</span>
                  <span>•</span>
                  <span>Key: {beats[currentBeat].key}</span>
                  <span>•</span>
                  <span>{beats[currentBeat].duration}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="h-1 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-primary rounded-full" />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePrevious}
                  className="text-primary hover:text-primary/80"
                >
                  <SkipBack size={24} />
                </Button>
                <Button
                  size="icon"
                  onClick={handlePlayPause}
                  className="w-16 h-16 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={handleNext} className="text-primary hover:text-primary/80">
                  <SkipForward size={24} />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Beat List */}
        <div className="grid gap-2">
          {beats.map((beat, index) => (
            <button
              key={beat.id}
              onClick={() => setCurrentBeat(index)}
              className={`w-full p-4 rounded flex items-center justify-between transition-colors ${
                currentBeat === index
                  ? "bg-primary/10 border border-primary"
                  : "bg-card/30 hover:bg-card/50 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground font-mono text-sm w-8">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-foreground font-medium">{beat.title}</span>
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span>{beat.bpm} BPM</span>
                <span>{beat.key}</span>
                <span className="font-mono">{beat.duration}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
