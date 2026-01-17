"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Tag, FileText, Info } from "lucide-react"

interface FAQItem {
  id: string
  question: string
  answer: string
  category: "pricing" | "licenses" | "general"
  is_published?: boolean | null
  order_index?: number | null
}

// Labels for categories
const categoryLabels: Record<FAQItem["category"], string> = {
  pricing: "Ceny",
  licenses: "Licencje",
  general: "Ogólne",
}

// Icons for categories – using primary color instead of orange
const categoryIcons: Record<FAQItem["category"], React.ReactNode> = {
  pricing: <Tag size={18} className="text-primary" />,
  licenses: <FileText size={18} className="text-primary" />,
  general: <Info size={18} className="text-primary" />,
}

export function FAQSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  // Static FAQ items provided by user
  const faqItems: FAQItem[] = [
    {
      id: "1",
      question: "Jakie licencje oferujesz?",
      answer: "MP3, WAV + STEMS oraz licencję na wyłączność. Szczegóły każdej licencji są widoczne przy bicie.",
      category: "licenses",
    },
    {
      id: "2",
      question: "Czy mogę użyć beatu do Spotify i streamingów?",
      answer: "Tak, każda licencja pozwala na publikację utworu. Zakres zależy od wybranej opcji.",
      category: "licenses",
    },
    {
      id: "3",
      question: "Czy bity są sprzedawane wielu osobom?",
      answer: "Tak, chyba że kupisz licencję na wyłączność. Wtedy beat znika ze sklepu.",
      category: "licenses",
    },
    {
      id: "4",
      question: "Czy mogę dostać poprawki do beatu?",
      answer: "Poprawki są możliwe tylko przy zamówieniach custom i wyłączności.",
      category: "general",
    },
    {
      id: "5",
      question: "Jak szybko dostanę pliki po zakupie?",
      answer: "Automatycznie po opłaceniu zamówienia.",
      category: "general",
    },
    {
      id: "6",
      question: "Czy robisz bity na zamówienie?",
      answer: "Tak. Szczegóły znajdziesz w zakładce Custom Beats.",
      category: "general",
    },
  ]

  // Group FAQs by category for clear separation
  const grouped = faqItems.reduce<Record<FAQItem["category"], FAQItem[]>>(
    (acc, item) => {
      acc[item.category] = acc[item.category] ? [...acc[item.category], item] : [item]
      return acc
    },
    { pricing: [], licenses: [], general: [] },
  )

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <section className="relative py-32 md:py-40 bg-background px-6 lg:px-12">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-20 fade-in-up">
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-4">
            Wszystko o naszych usługach
          </p>
          <h2 className="font-serif text-5xl md:text-6xl font-light text-primary mb-6">Najczęściej pytane</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Odpowiedzi na najważniejsze pytania dotyczące cen, licencji i ogólnych kwestii.
          </p>
        </div>

        {/* Categories */}
        {Object.keys(grouped).map((categoryKey) => {
          const category = categoryKey as FAQItem["category"]
          const items = grouped[category]
          if (!items || items.length === 0) return null
          return (
            <div key={category} className="mb-16 fade-in-up">
              <h3 className="text-sm uppercase tracking-[0.25em] text-primary font-semibold mb-6">
                {categoryLabels[category]}
              </h3>
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="bg-card/30 hover:bg-card/40 border border-border/50 hover:border-border transition-all duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <button
                      onClick={() => handleToggle(item.id)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-3">
                        {/* Category icon */}
                        {categoryIcons[item.category]}
                        <h4 className="font-semibold text-primary">
                          {item.question}
                        </h4>
                      </div>
                      <ChevronDown
                        size={20}
                        className={`text-primary flex-shrink-0 transition-transform duration-300 ${expandedId === item.id ? "rotate-180" : ""
                          }`}
                      />
                    </button>
                    {expandedId === item.id && (
                      <div className="px-6 pb-5 border-t border-border animate-slideInFromRight">
                        <p className="text-muted-foreground leading-relaxed text-sm md:text-base pt-4">
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}