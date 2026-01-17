"use client"

import { useState, useEffect } from "react"
import type { CartItem, Beat } from "@/lib/types"
import { createBrowserClient } from "@supabase/ssr"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"
import { CheckoutForm } from "@/components/checkout-form"

export function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [beats, setBeats] = useState<Record<string, Beat>>({})
  const [loading, setLoading] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState<"card" | "blik" | "apple" | "google">("card")

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

  const total = cartItems.reduce((sum, item) => sum + item.price, 0)

  if (loading) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center pt-32">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 text-primary mx-auto animate-spin" />
          <p className="text-muted-foreground">Ładowanie checkout...</p>
        </div>
      </section>
    )
  }

  if (cartItems.length === 0) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center pt-32">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-light text-primary">Koszyk jest pusty</h1>
            <p className="text-muted-foreground">Aby kontynuować, dodaj beaty do koszyka</p>
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
    <section className="py-20 md:py-32 pt-32">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="mb-8">
          <Link
            href="/koszyk"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Wróć do koszyka
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="mb-12">
              <h1 className="font-serif text-5xl font-light text-primary mb-4">Finalizuj Zakup</h1>
              <p className="text-muted-foreground">Uzupełnij dane i wybierz metodę płatności</p>
            </div>

            <CheckoutForm cartItems={cartItems} total={total} paymentMethod={paymentMethod} />
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-card/30 border border-border/50 rounded-sm p-6 sticky top-32">
              <h3 className="text-lg font-semibold text-primary mb-6">Podsumowanie Zamówienia</h3>

              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {cartItems.map((item) => {
                  const beat = beats[item.beat_id]
                  return (
                    <div key={item.id} className="flex gap-3">
                      {beat?.cover_image_url && (
                        <div className="relative w-16 h-16 rounded-sm overflow-hidden flex-shrink-0">
                          <Image
                            src={beat.cover_image_url || "/placeholder.svg"}
                            alt={beat.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-primary truncate">{beat?.title || "Nieznany beat"}</p>
                        <p className="text-xs text-muted-foreground">{item.license_type.toUpperCase()}</p>
                        <p className="text-sm font-semibold text-accent mt-1">{(item.price / 100).toFixed(2)} zł</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="border-t border-border/50 pt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Razem:</span>
                  <span className="font-semibold text-primary">{(total / 100).toFixed(2)} zł</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
