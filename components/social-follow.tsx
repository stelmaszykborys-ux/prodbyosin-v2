"use client"

import { Instagram, Youtube, Facebook, Music2 } from "lucide-react"

/**
 * A simple call‑to‑action section encouraging visitors to follow on social media.
 * Placed above the footer on selected pages to increase visibility of
 * social profiles.
 */
export function SocialFollow() {
  return (
    <section className="relative py-24 md:py-32 bg-gradient-to-b from-black via-amber-950/10 to-black">
      <div className="container mx-auto px-6 lg:px-12 text-center fade-in-up">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-600 font-semibold mb-4">Bądź na bieżąco</p>
        <h2 className="font-serif text-5xl md:text-6xl font-light text-white mb-8">Obserwuj mnie</h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-12">
          Sprawdź moje profile w social media, aby nie przegapić nowych beatów, kulis pracy i ekskluzywnych ofert.
        </p>
        <div className="flex justify-center gap-6">
          <a
            href="#"
            className="text-amber-600 hover:text-amber-400 transition-colors"
            aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram size={36} />
          </a>
          <a
            href="#"
            className="text-amber-600 hover:text-amber-400 transition-colors"
            aria-label="YouTube"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Youtube size={36} />
          </a>
          <a
            href="#"
            className="text-amber-600 hover:text-amber-400 transition-colors"
            aria-label="Facebook"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Facebook size={36} />
          </a>
          <a
            href="#"
            className="text-amber-600 hover:text-amber-400 transition-colors"
            aria-label="Spotify"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Music2 size={36} />
          </a>
        </div>
      </div>
    </section>
  )
}