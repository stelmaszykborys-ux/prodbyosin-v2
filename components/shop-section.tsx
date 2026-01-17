"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const pricingTiers = [
  {
    name: "Basic Lease",
    price: "150",
    format: "MP3",
    features: ["Pobierz plik MP3", "Podstawowa licencja", "Do użytku niekomercyjnego", "Natychmiastowa dostawa"],
  },
  {
    name: "Professional",
    price: "250",
    format: "WAV + STEMS",
    features: [
      "Plik WAV wysokiej jakości",
      "Wszystkie STEMy",
      "Użytek komercyjny",
      "Natychmiastowa dostawa",
      "Email support",
    ],
    highlighted: true,
  },
  {
    name: "Exclusive",
    price: "450",
    format: "Wyłączność",
    features: [
      "Pełna wyłączność",
      "WAV + STEMS",
      "Pełne prawa autorskie",
      "Możliwość poprawek",
      "Priority support",
      "Kontakt bezpośredni",
    ],
  },
]

export function ShopSection() {
  return (
    <section id="sklep" className="py-24 px-4 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="font-serif text-5xl md:text-6xl font-light text-primary mb-4">Cennik</h2>
          <p className="text-muted-foreground uppercase tracking-wider text-sm max-w-2xl mx-auto">
            Wybierz pakiet idealny dla Twojego projektu. Wszystkie opcje zawierają jasne licencje.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {pricingTiers.map((tier) => (
            <Card
              key={tier.name}
              className={`relative p-8 bg-card/50 backdrop-blur-sm border transition-all hover:scale-105 ${
                tier.highlighted
                  ? "border-primary shadow-xl shadow-primary/20"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs uppercase tracking-wider">
                    Najpopularniejszy
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="font-serif text-2xl text-foreground mb-2">{tier.name}</h3>
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-6">{tier.format}</p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="font-serif text-5xl text-primary">{tier.price}</span>
                  <span className="text-muted-foreground">zł</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="text-primary flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-sm text-muted-foreground leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full uppercase tracking-wider ${
                  tier.highlighted
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                Wybierz pakiet
              </Button>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Płatności obsługiwane przez bezpieczny system. Akceptujemy karty, BLIK, Apple Pay i Google Pay. Po zakupie
            otrzymasz automatyczną wysyłkę plików na podany email.
          </p>
        </div>
      </div>
    </section>
  )
}
