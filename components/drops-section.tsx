"use client"

import type { Drop } from "@/lib/types"
import { DropCard } from "@/components/drop-card"

interface DropsSectionProps {
  drops: Drop[]
}

export function DropsSection({ drops }: DropsSectionProps) {
  if (!drops || drops.length === 0) {
    return (
      <section id="drops" className="relative py-24 md:py-32 w-full bg-gradient-to-b from-black via-gray-950 to-black">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center space-y-6 fade-in-up">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-600/70">Nasze Kolekcje</p>
            <h2 className="font-serif text-6xl md:text-7xl font-light text-white">TWO MIND</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Przeglądaj i inspiruj się</p>
            <div className="pt-4">
              <p className="text-gray-500 text-sm tracking-widest uppercase">New drops coming soon</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="drops" className="relative py-24 md:py-32 w-full bg-gradient-to-b from-black via-gray-950 to-black">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="mb-20 space-y-4 fade-in-up">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-600/70 font-semibold">Nasze Kolekcje</p>
          <h2 className="font-serif text-6xl md:text-7xl font-light text-white">Aktualny Drop</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-amber-600 to-transparent" />
          <p className="text-gray-400 text-lg max-w-2xl">Przeglądaj i inspiruj się</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {drops.map((drop, index) => (
            <div key={drop.id} style={{ animationDelay: `${index * 0.1}s` }} className="fade-in-up">
              <DropCard drop={drop} />
            </div>
          ))}
        </div>

        {/* View All button - profesjonalny styl */}
        <div className="flex justify-center pt-8 fade-in-up" style={{ animationDelay: "0.4s" }}>
          <a
            href="/sklep"
            className="px-8 py-3 bg-white text-black rounded-full font-semibold uppercase tracking-wider text-sm hover:bg-amber-100 hover:text-black transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-amber-900/30 border border-amber-100/30"
          >
            Wyświetl wszystkie
          </a>
        </div>
      </div>
    </section>
  )
}
