"use client"

import type React from "react"

import { useState } from "react"
import type { CartItem } from "@/lib/types"
import { Loader2 } from "lucide-react"
import { createCheckoutSession } from "@/app/actions/checkout"
import { useRouter } from "next/navigation"

interface CheckoutFormProps {
  cartItems: CartItem[]
  total: number
  paymentMethod: "card" | "blik" | "apple" | "google"
}

export function CheckoutForm({ cartItems, total, paymentMethod }: CheckoutFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
  })
  const [paymentType, setPaymentType] = useState<"card" | "blik">("card")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const sessionId = localStorage.getItem("cart_session_id")
      if (!sessionId) throw new Error("Brak sesji koszyka")

      console.log("Starting checkout for session:", sessionId, "Total:", total)

      const result = await createCheckoutSession({
        cartItems,
        total,
        sessionId,
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        paymentType,
      })

      console.log("Checkout result:", result)

      // Redirect to Stripe checkout
      if (result && result.url) {
        console.log("Redirecting to:", result.url)
        window.location.href = result.url
      } else {
        throw new Error("Nieprawidłowa odpowiedź z serwera płatności (Brak URL przekierowania)")
      }
    } catch (err: any) {
      console.error("Checkout handleSubmit error:", err)
      setError(err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd podczas płatności. Spróbuj ponownie.")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Contact Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">Dane Kontaktowe</h3>

        <div className="space-y-3">
          <input
            type="email"
            name="email"
            placeholder="Twój email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-card/30 border border-border/50 rounded-sm px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />

          <input
            type="text"
            name="name"
            placeholder="Imię i nazwisko"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-card/30 border border-border/50 rounded-sm px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Numer telefonu"
            value={formData.phone}
            onChange={handleChange}
            className="w-full bg-card/30 border border-border/50 rounded-sm px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      {/* Payment Method */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">Metoda Płatności</h3>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setPaymentType("card")}
            className={`p-4 rounded-sm border transition-colors ${paymentType === "card"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border/50 bg-card/30 text-muted-foreground hover:border-primary/50"
              }`}
          >
            <p className="font-semibold text-sm">Karta Kredytowa</p>
            <p className="text-xs mt-1">Visa, Mastercard, Amex</p>
          </button>

          <button
            type="button"
            onClick={() => setPaymentType("blik")}
            className={`p-4 rounded-sm border transition-colors ${paymentType === "blik"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border/50 bg-card/30 text-muted-foreground hover:border-primary/50"
              }`}
          >
            <p className="font-semibold text-sm">BLIK</p>
            <p className="text-xs mt-1">Transfer natychmiast</p>
          </button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Bezpieczne płatności przez Stripe (Karta, BLIK, Apple Pay, Google Pay)
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/50 text-destructive p-4 rounded-sm text-sm">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-[0.15em] text-xs py-4 px-8 rounded-sm transition-colors font-semibold flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? "Przetwarzanie..." : `Zapłać ${(total / 100).toFixed(2)} zł`}
      </button>
    </form>
  )
}
