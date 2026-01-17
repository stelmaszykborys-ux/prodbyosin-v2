"use client"

import { useState } from "react"
import { Play, Pause, ShoppingCart, Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Beat } from "@/lib/types"
import { useCart } from "@/input/cart-provider"
import { cn } from "@/lib/utils"

interface BeatCardProps {
  beat: Beat
  onPlay?: (beat: Beat) => void
  isPlaying?: boolean
}

export function BeatCard({ beat, onPlay, isPlaying = false }: BeatCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showLicenses, setShowLicenses] = useState(false)
  const { addToCart } = useCart()
  const [addedToCart, setAddedToCart] = useState<string | null>(null) // 'mp3', 'wav', or 'stems'

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
      minimumFractionDigits: 0,
    }).format(priceInCents / 100)
  }

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    onPlay?.(beat)
  }

  const handleAddToCart = async (e: React.MouseEvent, license: "mp3" | "wav" | "stems", price: number) => {
    e.stopPropagation()
    e.preventDefault()

    await addToCart({
      beat_id: beat.id,
      license_type: license,
      price: price
    })

    setAddedToCart(license)
    setTimeout(() => setAddedToCart(null), 2000)
  }

  return (
    <div
      className="group relative bg-[#0a0a0a] border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setShowLicenses(false)
      }}
    >
      {/* Cover Image - REMOVED as requested, using technical dark placeholder */}
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-900 border-b border-white/5 flex items-center justify-center group-hover:bg-zinc-800 transition-colors">

        <div className="mt-auto relative w-full h-full flex items-center justify-center group-hover:bg-black/20 transition-colors">
          {/* Main Play Button - Always visible or prominent */}
          <button
            onClick={handlePlayClick}
            className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 transform shadow-2xl",
              isPlaying
                ? "bg-amber-500 text-black scale-110"
                : "bg-zinc-800/80 text-zinc-400 hover:bg-amber-500 hover:text-black hover:scale-110 backdrop-blur-sm border border-white/10"
            )}
          >
            {isPlaying ? (
              <Pause size={32} fill="currentColor" />
            ) : (
              <Play size={32} fill="currentColor" className="ml-1" />
            )}
          </button>
        </div>

        {/* Badges */}
        {beat.is_featured && <div className="absolute top-2 left-2 bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">Featured</div>}
      </div>

      {/* Info Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1">
          <Link href={`/sklep/${beat.slug}`} className="hover:text-amber-500 transition-colors">
            <h3 className="text-lg font-bold text-white truncate pr-2">{beat.title}</h3>
          </Link>
          <span className="text-amber-500 font-mono font-bold">{formatPrice(beat.price_mp3)}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-4 font-mono uppercase tracking-wide">
          <span>{beat.bpm} BPM</span>
          <span>•</span>
          <span>{beat.key}</span>
        </div>

        <div className="mt-auto relative">
          {/* Main Buy Button */}
          <button
            onClick={() => setShowLicenses(!showLicenses)}
            className="w-full h-10 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-amber-500 transition-colors flex items-center justify-center gap-2"
          >
            {showLicenses ? (
              <span>Close</span>
            ) : (
              <>
                <span>Purchase</span>
                <Plus size={14} />
              </>
            )}
          </button>

          {/* Licenses Overlay */}
          <div className={cn(
            "absolute bottom-full left-0 right-0 mb-2 bg-[#0a0a0a] border border-white/10 shadow-xl p-2 space-y-2 transition-all duration-200 origin-bottom z-20",
            showLicenses ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
          )}>
            <div className="text-xs text-zinc-500 text-center uppercase tracking-widest mb-1">Select License</div>

            {/* Basic - MP3 */}
            <button
              onClick={(e) => handleAddToCart(e, "mp3", beat.price_mp3)}
              className="w-full flex items-center justify-between p-2 hover:bg-white/5 transition-colors group/btn border border-transparent hover:border-white/10"
            >
              <div className="flex flex-col items-start">
                <span className="text-xs font-bold text-white uppercase">Basic Lease</span>
                <span className="text-[10px] text-zinc-500">MP3 File</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-amber-500 font-mono">{formatPrice(beat.price_mp3)}</span>
                {addedToCart === "mp3" ? <Check size={14} className="text-green-500" /> : <ShoppingCart size={14} className="text-zinc-600 group-hover/btn:text-white" />}
              </div>
            </button>

            {/* Premium - WAV */}
            <button
              onClick={(e) => handleAddToCart(e, "wav", beat.price_wav)}
              className="w-full flex items-center justify-between p-2 hover:bg-white/5 transition-colors group/btn border border-transparent hover:border-white/10"
            >
              <div className="flex flex-col items-start">
                <span className="text-xs font-bold text-white uppercase">Premium Lease</span>
                <span className="text-[10px] text-zinc-500">WAV File</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-amber-500 font-mono">{formatPrice(beat.price_wav)}</span>
                {addedToCart === "wav" ? <Check size={14} className="text-green-500" /> : <ShoppingCart size={14} className="text-zinc-600 group-hover/btn:text-white" />}
              </div>
            </button>

            {/* Exclusive - Stems */}
            <button
              onClick={(e) => handleAddToCart(e, "stems", beat.price_stems)}
              className="w-full flex items-center justify-between p-2 hover:bg-white/5 transition-colors group/btn border border-transparent hover:border-white/10"
            >
              <div className="flex flex-col items-start">
                <span className="text-xs font-bold text-white uppercase">Exclusive</span>
                <span className="text-[10px] text-zinc-500">WAV + Rights</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-amber-500 font-mono">{formatPrice(beat.price_stems)}</span>
                {addedToCart === "stems" ? <Check size={14} className="text-green-500" /> : <ShoppingCart size={14} className="text-zinc-600 group-hover/btn:text-white" />}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

