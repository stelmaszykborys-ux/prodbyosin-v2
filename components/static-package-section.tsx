"use client"

import { useEffect, useState } from "react"
import type { StaticPackage } from "@/lib/types"
import { createBrowserClient } from "@supabase/ssr"
import Link from "next/link"
import Image from "next/image"

export function StaticPackageSection() {
  const [pkg, setPkg] = useState<StaticPackage | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPackage = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )

      const { data } = await supabase.from("static_package").select("*").limit(1).single()

      setPkg(data)
      setLoading(false)
    }

    fetchPackage()
  }, [])

  if (loading) {
    return (
      <section className="relative py-24 md:py-32 w-full bg-gradient-to-b from-black to-gray-950">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="shimmer h-64 bg-gray-800 rounded" />
        </div>
      </section>
    )
  }

  if (!pkg) {
    return (
      <section className="relative py-24 md:py-32 w-full bg-gradient-to-b from-black to-gray-950">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center space-y-6 fade-in-up">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-600/70">Specjalna Oferta</p>
            <h2 className="font-serif text-5xl md:text-6xl font-light text-white">Stała Paczka</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Zmieniana co 3 miesiące</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative py-24 md:py-32 w-full bg-gradient-to-b from-black to-gray-950">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center fade-in-up">
          {/* Lewa strona - obraz */}
          <div className="relative aspect-video overflow-hidden bg-gray-900 border border-amber-900/30 hover:border-amber-700/60 transition-all duration-500 shadow-lg hover:shadow-xl hover:shadow-amber-900/20">
            {pkg.background_image_url && (
              <Image
                src={pkg.background_image_url || "/placeholder.svg"}
                alt={pkg.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          {/* Prawa strona - tekst */}
          <div className="space-y-6 slide-in-right">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.3em] text-amber-600/70 font-semibold">Specjalna Oferta</p>
              <h2 className="font-serif text-5xl md:text-6xl font-light text-white">{pkg.title}</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-amber-600 to-transparent" />
            </div>

            {pkg.description && (
              <p className="text-gray-300 text-lg leading-relaxed max-w-lg font-light">{pkg.description}</p>
            )}

            <p className="text-sm text-amber-600/70 uppercase tracking-wider font-semibold">Zmieniana co 3 miesiące</p>

            <Link href="/paczka-statyczna">
              <button className="bg-white text-black px-8 py-3 font-semibold uppercase tracking-wider text-sm hover:bg-amber-100 hover:text-black transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-amber-900/30 border border-amber-100/30">
                Przegląd Paczki →
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
