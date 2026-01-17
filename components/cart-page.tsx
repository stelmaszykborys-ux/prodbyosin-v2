"use client"

import { useState, useEffect } from "react"
import type { CartItem, Beat } from "@/lib/types"
import { createBrowserClient } from "@supabase/ssr"
import Image from "next/image"
import Link from "next/link"
import { Trash2, ShoppingBag } from "lucide-react"
import { useCart } from "@/input/cart-provider"

export function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [beats, setBeats] = useState<Record<string, Beat>>({})
  const [loading, setLoading] = useState(true)
  const { removeFromCart } = useCart()

  useEffect(() => {
    const loadCart = async () => {
      const sessionId = localStorage.getItem("cart_session_id")
      if (!sessionId) {
        setLoading(false)
        return
      }

      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )

      const { data: items } = await supabase.from("cart_items").select("*, beat:beats(*)").eq("session_id", sessionId)

      if (items) {
        setCartItems(items as CartItem[])
        const beatsMap: Record<string, Beat> = {}
        items.forEach((item: any) => {
          if (item.beat) beatsMap[item.beat_id] = item.beat
        })
        setBeats(beatsMap)
      }

      setLoading(false)
    }

    loadCart()
  }, [])

  const removeItem = async (itemId: string) => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    await supabase.from("cart_items").delete().eq("id", itemId)
    setCartItems(cartItems.filter((item) => item.id !== itemId))
    removeFromCart() // Decrement cart count
  }

  const total = cartItems.reduce((sum, item) => sum + item.price, 0)

  if (loading) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Ładowanie koszyka...</p>
        </div>
      </section>
    )
  }

  if (cartItems.length === 0) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-6">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto opacity-50" />
          <div className="space-y-2">
            <h1 className="text-4xl font-light text-primary">Twój koszyk jest pusty</h1>
            <p className="text-muted-foreground">Dodaj beaty aby kontynuować zakupy</p>
          </div>
          <Link href="/">
            <button className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-[0.15em] text-xs px-8 py-4 rounded-sm transition-colors">
              Wróć na stronę główną
            </button>
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="pt-32 pb-24">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="font-serif text-5xl md:text-6xl font-light text-primary mb-4">Twój Koszyk</h1>
            <p className="text-muted-foreground">
              {cartItems.length} {cartItems.length === 1 ? "produkt" : "produktów"} w koszyku
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-14">
            <div className="space-y-4">
              {cartItems.map((item) => {
                const beat = beats[item.beat_id]
                return (
                  <div
                    key={item.id}
                    className="flex gap-6 p-6 border border-border/50 rounded-sm bg-card/30 hover:bg-card/50 transition-colors"
                  >
                    {beat?.cover_image_url && (
                      <div className="relative w-24 h-24 rounded-sm overflow-hidden flex-shrink-0">
                        <Image
                          src={beat.cover_image_url || "/placeholder.svg"}
                          alt={beat.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-primary truncate">{beat?.title || "Nieznany beat"}</h3>
                      <p className="text-sm text-muted-foreground uppercase tracking-wider mt-2">
                        Licencja: {item.license_type.toUpperCase()}
                      </p>
                      {beat && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {beat.bpm} BPM • {beat.genre}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-4">
                      <p className="text-lg font-semibold text-primary">{(item.price / 100).toFixed(2)} zł</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:text-destructive/80 transition-colors p-2"
                        aria-label="Usuń z koszyka"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Summary */}
            <aside className="lg:sticky lg:top-28 h-fit">
              <div className="border border-border/50 rounded-sm bg-card/30 p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground uppercase tracking-[0.2em]">Podsumowanie</p>
                  <p className="text-xs text-muted-foreground">Bez konta</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Suma produktów</span>
                    <span className="text-foreground">{(total / 100).toFixed(2)} zł</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Dostawa</span>
                    <span className="text-foreground">0.00 zł</span>
                  </div>
                  <div className="border-t border-border/50 pt-4 flex justify-between items-end">
                    <span className="text-muted-foreground">Razem</span>
                    <span className="font-serif text-3xl font-light text-primary">{(total / 100).toFixed(2)} zł</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href="/checkout">
                    <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-[0.15em] text-xs py-4 px-8 rounded-sm transition-colors font-semibold">
                      Przejdź do Kasy
                    </button>
                  </Link>
                  <Link href="/">
                    <button className="w-full border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/50 uppercase tracking-[0.15em] text-xs py-4 px-8 rounded-sm transition-colors">
                      Kontynuuj Zakupy
                    </button>
                  </Link>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  Po zakupie pliki otrzymasz automatycznie na e‑mail. W przypadku licencji EXCLUSIVE użyj opcji kontaktu.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  )
}
