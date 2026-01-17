"use client"

import { useEffect, useState } from "react"
import type { StaticPackage } from "@/lib/types"
import { createBrowserClient } from "@supabase/ssr"
import Link from "next/link"
import Image from "next/image"

export function StaticPackagePreview() {
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

  if (loading || !pkg) return null

  return (
    <section className="relative py-20 md:py-32 w-full bg-background">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5" />
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square overflow-hidden rounded-sm border border-border/50">
            {pkg.background_image_url && (
              <Image
                src={pkg.background_image_url || "/placeholder.svg"}
                alt={pkg.title}
                fill
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Stała Paczka</p>
              <h2 className="font-serif text-5xl md:text-6xl font-light text-primary">{pkg.title}</h2>
            </div>

            {pkg.description && (
              <p className="text-muted-foreground text-lg leading-relaxed max-w-lg">{pkg.description}</p>
            )}

            <p className="text-sm text-accent uppercase tracking-wider">Zmieniana co 3 miesiące</p>

            <Link href="/paczka-statyczna">
              <button className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-[0.15em] text-xs px-8 py-4 rounded-sm transition-colors">
                Przegląd Paczki →
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
