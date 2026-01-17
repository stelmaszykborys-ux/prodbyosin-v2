"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { Check, Music, Send, Sparkles } from "lucide-react"

export default function CustomBeatsClient() {
  const [submitted, setSubmitted] = useState(false)

  const features = [
    "Indywidualne podejście do Twojej wizji",
    "Nielimitowane poprawki do uzyskania ideału",
    "Najwyższa jakość plików WAV i STEMS",
    "Pełne dopasowanie do Twojego stylu i wokalu",
    "Możliwość wykupienia wyłączności (Exclusive)"
  ]

  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary/30">
      <Navigation />

      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <section className="relative z-10 container mx-auto px-6 lg:px-12 pt-32 pb-24">
        <div className="max-w-4xl mx-auto">

          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="font-serif text-5xl md:text-7xl mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              CUSTOM BEATS
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-primary/50 to-transparent mx-auto mb-8 rounded-full" />
            <p className="text-xl md:text-2xl text-muted-foreground font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
              Tworzę brzmienie skrojone idealnie pod Ciebie. <br />
              <span className="text-primary/80">Twoja wizja, moje wykonanie.</span>
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-start">

            {/* Features Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-xl shadow-2xl relative overflow-hidden group hover:border-primary/20 transition-colors duration-500">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Music size={120} />
                </div>

                <h3 className="text-2xl font-serif mb-6 flex items-center gap-3">
                  <Sparkles className="text-primary" size={24} />
                  Co otrzymasz?
                </h3>

                <ul className="space-y-5 relative z-10">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-4 text-gray-300 font-light">
                      <div className="mt-1 min-w-[20px] h-[20px] rounded-full bg-primary/20 flex items-center justify-center">
                        <Check size={12} className="text-primary" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 border-l-2 border-primary/30 pl-6 italic text-muted-foreground">
                "Nie sprzedaję tylko bitu. Sprzedaję brzmienie, które sprawi, że Twój numer wyróżni się z tłumu."
              </div>
            </motion.div>

            {/* Form Column */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-xl shadow-2xl">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                      <Check size={40} className="text-green-500" />
                    </div>
                    <h2 className="font-serif text-3xl text-white mb-4">Wiadomość wysłana!</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Dzięki za kontakt. Przeanalizuję Twoje zgłoszenie i odezwę się z wyceną w ciągu 24h.
                    </p>
                  </motion.div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      setSubmitted(true)
                    }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-2xl font-serif mb-2">Opisz swój projekt</h3>
                      <p className="text-muted-foreground text-sm mb-6">Wypełnij formularz, aby sformułować zamówienie.</p>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                        Twój e-mail
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-white/20"
                        placeholder="prodbymuzyk@gmail.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                        Szczegóły zamówienia
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        required
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-white/20 resize-none"
                        placeholder="Napisz jaki klimat Cię interesuje. Możesz wkleić linki do referencji (YouTube/Spotify). Podaj BPM, tonację (opcjonalnie)."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-white text-black hover:bg-gray-200 font-bold text-sm uppercase tracking-widest py-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 mt-4"
                    >
                      <Send size={18} />
                      Wyślij zapytanie
                    </button>

                    <p className="text-xs text-center text-muted-foreground pt-4">
                      Odpowiadam zazwyczaj tego samego dnia.
                    </p>
                  </form>
                )}
              </div>
            </motion.div>

          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
