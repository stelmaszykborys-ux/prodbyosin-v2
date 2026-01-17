"use client"

import { ArrowRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-background">
      <div className="absolute inset-0">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20" />
        {/* Decorative elements */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-6 lg:px-12 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full py-32">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Premium Beats & Production</p>
              <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-primary leading-none">
                prodby
                <span className="block text-accent">osin</span>
              </h1>
            </div>

            <p className="text-muted-foreground text-lg max-w-md leading-relaxed">
              Tworzę unikalne beaty, które wyróżnią Twoją muzykę. Każdy beat to starannie dopracowana produkcja gotowa
              na sukces.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/sklep">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-[0.15em] text-xs px-8 py-6 group"
                >
                  Przeglądaj Beaty
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/o-mnie">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/30 text-primary hover:bg-primary/10 uppercase tracking-[0.15em] text-xs px-8 py-6 bg-transparent"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Poznaj Mnie
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative">
              {/* Main card */}
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-sm p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Wyróżniony Beat</span>
                  <span className="text-xs text-primary">New</span>
                </div>

                <div className="aspect-square bg-gradient-to-br from-secondary to-muted rounded-sm flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <span className="font-serif text-9xl text-primary/20 select-none">O</span>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="font-serif text-2xl text-primary">Midnight Dreams</p>
                    <p className="text-sm text-muted-foreground">140 BPM • Am • Trap</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-light text-primary">150+</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Beatów</p>
                  </div>
                  <div>
                    <p className="text-2xl font-light text-primary">50+</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Klientów</p>
                  </div>
                  <div>
                    <p className="text-2xl font-light text-primary">5+</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Lat</p>
                  </div>
                </div>
              </div>

              {/* Decorative floating cards */}
              <div className="absolute -top-4 -right-4 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-sm p-4 animate-pulse">
                <p className="text-xs text-primary uppercase tracking-wider">Od 150 zł</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  )
}
