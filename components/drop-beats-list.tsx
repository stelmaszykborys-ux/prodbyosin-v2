"use client"

import { useState } from "react"
import { Beat } from "@/lib/types"
import { useCart } from "@/input/cart-provider"
import { MinimalAudioPlayer } from "@/components/minimal-audio-player"

interface DropBeatsListProps {
  beats: Beat[]
}

/**
 * Displays a vertical list of beats with audio players and license selection.
 * Each beat shows its title, BPM, key and a preview player. The license menu allows
 * users to add the beat to cart or, in case of the exclusive option, open a contact form.
 */
export function DropBeatsList({ beats }: DropBeatsListProps) {
  // Track which beat's license menu is open
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [exclusiveForBeat, setExclusiveForBeat] = useState<Beat | null>(null)
  const { addToCart } = useCart()

  const handleAddToCart = async (beat: Beat, license: "mp3" | "wav" | "stems") => {
    const prices: Record<"mp3" | "wav" | "stems", number> = {
      mp3: beat.price_mp3,
      wav: beat.price_wav,
      stems: beat.price_stems,
    }
    await addToCart({ beat_id: beat.id, license_type: license, price: prices[license] })
    setOpenMenuId(null)
  }

  return (
    <div className="space-y-12">
      {beats.map((beat) => (
        <div key={beat.id} className="border border-border/50 p-6 rounded-sm bg-card/40">
          {/* Beat info */}
          <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-serif text-3xl text-primary mb-2">{beat.title}</h2>
              <p className="text-muted-foreground text-sm">
                {beat.key || "?"} • {beat.bpm || "-"} BPM
              </p>
            </div>
            <button
              className="mt-4 md:mt-0 bg-primary text-primary-foreground px-6 py-2 uppercase text-xs tracking-wider font-semibold hover:bg-primary/80 transition-colors"
              onClick={() => setOpenMenuId(openMenuId === beat.id ? null : beat.id)}
            >
              Choose license
            </button>
          </div>

          {/* Audio preview */}
          <div className="mb-6">
            <MinimalAudioPlayer src={beat.audio_preview_url || ""} title={beat.title} />
          </div>

          {/* License dropdown */}
          {openMenuId === beat.id && (
            <div className="bg-secondary border border-border/50 rounded-sm p-4 space-y-2">
              {/* MP3 option */}
              <button
                onClick={() => handleAddToCart(beat, "mp3")}
                className="w-full flex justify-between items-center px-4 py-3 bg-card/20 hover:bg-card transition-colors rounded-sm text-left"
              >
                <span>MP3</span>
                <span className="text-muted-foreground">{(beat.price_mp3 / 100).toFixed(0)} zł</span>
              </button>
              {/* WAV option */}
              <button
                onClick={() => handleAddToCart(beat, "wav")}
                className="w-full flex justify-between items-center px-4 py-3 bg-card/20 hover:bg-card transition-colors rounded-sm text-left"
              >
                <span>WAV</span>
                <span className="text-muted-foreground">{(beat.price_wav / 100).toFixed(0)} zł</span>
              </button>
              {/* WAV + Stems option */}
              <button
                onClick={() => handleAddToCart(beat, "stems")}
                className="w-full flex justify-between items-center px-4 py-3 bg-card/20 hover:bg-card transition-colors rounded-sm text-left"
              >
                <span>WAV + STEMS</span>
                <span className="text-muted-foreground">{(beat.price_stems / 100).toFixed(0)} zł</span>
              </button>
              {/* Exclusive option */}
              <button
                onClick={() => setExclusiveForBeat(beat)}
                className="w-full flex justify-between items-center px-4 py-3 bg-card/20 hover:bg-card transition-colors rounded-sm text-left"
              >
                <span>EXCLUSIVE</span>
                <span className="text-muted-foreground">Contact</span>
              </button>
            </div>
          )}
        </div>
      ))}
      {/* Contact modal for Exclusive license */}
      {exclusiveForBeat && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-card border border-border/50 rounded-sm p-8 w-full max-w-md">
            <h3 className="text-2xl font-serif text-primary mb-4">Exclusive License Request</h3>
            <p className="text-muted-foreground mb-6">Send us an email with your request for the beat “{exclusiveForBeat.title}” and we'll get back to you with pricing.</p>
            <form action="mailto:your-email@example.com" method="GET" className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Your email"
                required
                className="w-full bg-card/30 border border-border/50 rounded-sm px-4 py-3 text-foreground focus:outline-none focus:border-primary/50"
              />
              <textarea
                name="body"
                placeholder="Your message"
                rows={4}
                className="w-full bg-card/30 border border-border/50 rounded-sm px-4 py-3 text-foreground focus:outline-none focus:border-primary/50"
                defaultValue={`Hello,\n\nI'm interested in an exclusive license for the beat "${exclusiveForBeat.title}".\n\nPlease let me know the pricing and terms.`}
              />
              <p className="text-sm text-muted-foreground">Or contact via Instagram: <a href="https://instagram.com/prodbyosin" target="_blank" className="underline">@prodbyosin</a></p>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setExclusiveForBeat(null)}
                  className="bg-muted text-muted-foreground px-5 py-2 rounded-sm hover:bg-muted/80"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground px-5 py-2 rounded-sm hover:bg-primary/80"
                >
                  Send email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}