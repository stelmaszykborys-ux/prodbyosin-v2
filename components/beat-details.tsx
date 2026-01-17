"use client"

import { useState } from "react"
import { Play, Pause, ShoppingCart, Check, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import type { Beat, LicenseType } from "@/lib/types"
import { LICENSE_NAMES, LICENSE_FEATURES } from "@/lib/types"

interface BeatDetailsProps {
  beat: Beat
}

export function BeatDetails({ beat }: BeatDetailsProps) {
  const [selectedLicense, setSelectedLicense] = useState<LicenseType>("mp3")
  const [isPlaying, setIsPlaying] = useState(false)

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(priceInCents / 100)
  }

  const prices: Record<LicenseType, number> = {
    mp3: beat.price_mp3,
    wav: beat.price_wav,
    stems: beat.price_stems,
  }

  const handleBuy = () => {
    // Navigate to checkout
    window.location.href = `/checkout?beat=${beat.id}&license=${selectedLicense}`
  }

  return (
    <div className="pt-32 pb-24 px-6 lg:px-12">
      <div className="container mx-auto max-w-6xl">
        {/* Back link */}
        <Link
          href="/sklep"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={16} className="mr-2" />
          Powrót do sklepu
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - Cover and Player */}
          <div className="space-y-6">
            <div className="relative aspect-square bg-gradient-to-br from-secondary to-muted rounded-sm overflow-hidden">
              {beat.cover_image_url ? (
                <img
                  src={beat.cover_image_url || "/placeholder.svg"}
                  alt={beat.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-serif text-[200px] text-primary/10 select-none">O</span>
                </div>
              )}

              {/* Play overlay */}
              <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  className="w-20 h-20 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                </Button>
              </div>

              {/* Badges */}
              {beat.is_featured && (
                <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs uppercase tracking-wider px-3 py-1">
                  Wyróżniony
                </div>
              )}
              {beat.is_sold && (
                <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground text-xs uppercase tracking-wider px-3 py-1">
                  Sprzedany
                </div>
              )}
            </div>

            {/* Beat info */}
            <div className="grid grid-cols-4 gap-4">
              {beat.bpm && (
                <div className="bg-card/50 border border-border/50 rounded-sm p-4 text-center">
                  <p className="text-2xl font-light text-primary">{beat.bpm}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">BPM</p>
                </div>
              )}
              {beat.key && (
                <div className="bg-card/50 border border-border/50 rounded-sm p-4 text-center">
                  <p className="text-2xl font-light text-primary">{beat.key}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Key</p>
                </div>
              )}
              {beat.genre && (
                <div className="bg-card/50 border border-border/50 rounded-sm p-4 text-center col-span-2">
                  <p className="text-lg font-light text-primary">{beat.genre}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Gatunek</p>
                </div>
              )}
            </div>
          </div>

          {/* Right - Details and Purchase */}
          <div className="space-y-8">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">{beat.mood || "Beat"}</p>
              <h1 className="font-serif text-4xl md:text-5xl font-light text-primary mb-4">{beat.title}</h1>
              {beat.description && <p className="text-muted-foreground leading-relaxed">{beat.description}</p>}
            </div>

            {/* Tags */}
            {beat.tags && beat.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {beat.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-secondary/50 text-muted-foreground text-xs uppercase tracking-wider px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* License Selection */}
            {!beat.is_sold && (
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-[0.2em] text-primary">Wybierz Licencję</h3>
                <div className="grid gap-3">
                  {(Object.keys(prices) as LicenseType[]).map((license) => (
                    <Card
                      key={license}
                      className={`p-4 cursor-pointer transition-all ${
                        selectedLicense === license
                          ? "border-primary bg-primary/5"
                          : "border-border/50 hover:border-primary/30"
                      }`}
                      onClick={() => setSelectedLicense(license)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                selectedLicense === license ? "border-primary bg-primary" : "border-muted-foreground"
                              }`}
                            >
                              {selectedLicense === license && <Check size={10} className="text-primary-foreground" />}
                            </div>
                            <span className="font-medium text-foreground">{LICENSE_NAMES[license]}</span>
                          </div>
                          <ul className="text-xs text-muted-foreground space-y-1 ml-6">
                            {LICENSE_FEATURES[license].map((feature) => (
                              <li key={feature}>• {feature}</li>
                            ))}
                          </ul>
                        </div>
                        <span className="text-xl font-light text-primary">{formatPrice(prices[license])}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Buy Button */}
            {!beat.is_sold ? (
              <Button
                size="lg"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-[0.15em] py-6"
                onClick={handleBuy}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Kup za {formatPrice(prices[selectedLicense])}
              </Button>
            ) : (
              <Button size="lg" disabled className="w-full uppercase tracking-[0.15em] py-6">
                Beat Sprzedany
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
