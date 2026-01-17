"use client"

import type { Drop } from "@/lib/types"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

interface DropCardProps {
  drop: Drop
}

export function DropCard({ drop }: DropCardProps) {
  // Calculate price or show default
  const price = drop.beat_count ? (drop.beat_count * 50).toFixed(2) : "149.99"

  return (
    <Link href={`/drop/${drop.slug}`}>
      <div className="group relative bg-[#0a0a0a] border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full overflow-hidden">
        {/* Cover Image */}
        <div className="relative aspect-square overflow-hidden bg-zinc-900">
          {drop.cover_image_url ? (
            <Image
              src={drop.cover_image_url || "/placeholder.svg"}
              alt={drop.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-900">
              <span className="text-zinc-700">No Image</span>
            </div>
          )}

          {/* Dark Overlay on Hover */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300" />
        </div>

        {/* Info Content */}
        <div className="p-5 flex flex-col flex-1 border-t border-white/5">
          <div className="mb-2">
            <h3 className="text-lg font-bold text-white truncate group-hover:text-amber-500 transition-colors">
              {drop.title}
            </h3>
            <p className="text-xs text-zinc-500 font-mono uppercase tracking-wide mt-1">
              {drop.genre || "Collection"} • {drop.beat_count || 10} Tracks
            </p>
          </div>

          <p className="text-sm text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
            {drop.description || "Premium beat collection."}
          </p>

          <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-amber-500 font-bold font-mono">
              {price} PLN
            </span>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white group-hover:text-amber-500 transition-colors">
              <span>View Pack</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

