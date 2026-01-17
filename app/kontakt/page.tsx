"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Mail, Instagram, Send, CheckCircle } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [contactInfo, setContactInfo] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  useEffect(() => {
    const fetchContactInfo = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )

      const { data } = await supabase.from("site_settings").select("value").eq("key", "contact_page").single()

      if (data?.value) {
        setContactInfo(data.value)
      }
    }

    fetchContactInfo()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setFormData({ name: "", email: "", subject: "", message: "" })
        setTimeout(() => setIsSubmitted(false), 5000)
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const defaultContact = {
    title: "Masz pytanie albo pomysł na współpracę?",
    subtitle: "Skontaktuj się",
    description: `Napisz, jeśli chcesz kupić beat, zamówić custom albo po prostu pogadać o projekcie. Odpowiadam możliwie najszybciej.\n\nW sprawach pilnych lub większych projektów – opisz dokładnie, czego potrzebujesz.`,
    email: "prodbyosin@gmail.com",
    instagram: "@prodbyosin",
    instagram_url: "https://www.instagram.com/prodbyosin/",
  }

  const contact = contactInfo || defaultContact

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-32 pb-24 px-6 lg:px-12">
        <div className="container mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left - Info */}
            <div className="space-y-8">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">{contact.subtitle}</p>
                <h1 className="font-serif text-5xl md:text-6xl font-light text-primary">{contact.title}</h1>
              </div>

              {contact.description && (
                <p className="text-muted-foreground leading-relaxed text-lg">{contact.description}</p>
              )}

              <div className="space-y-6">
                {contact.email && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-sm flex items-center justify-center">
                      <Mail className="text-primary" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Email</p>
                      <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                        {contact.email}
                      </a>
                    </div>
                  </div>
                )}

                {contact.instagram && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-sm flex items-center justify-center">
                      <Instagram className="text-primary" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Instagram</p>
                      <a href={contact.instagram_url} className="text-primary hover:underline">
                        {contact.instagram}
                      </a>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Right - Form */}
            <div className="bg-card/50 border border-border/50 rounded-sm p-8">
              {isSubmitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-primary" size={32} />
                  </div>
                  <h3 className="font-serif text-2xl text-primary">Wiadomość wysłana!</h3>
                  <p className="text-muted-foreground">Dziękuję za kontakt. Odpowiem najszybciej jak to możliwe.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs uppercase tracking-wider text-primary">
                      Imię
                    </label>
                    <input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Twoje imię"
                      className="w-full bg-background/50 border border-border rounded-sm px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs uppercase tracking-wider text-primary">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="twoj@email.com"
                      className="w-full bg-background/50 border border-border rounded-sm px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-xs uppercase tracking-wider text-primary">
                      Temat
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="W jakiej sprawie piszesz?"
                      className="w-full bg-background/50 border border-border rounded-sm px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-xs uppercase tracking-wider text-primary">
                      Wiadomość
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Opisz szczegóły..."
                      rows={5}
                      className="w-full bg-background/50 border border-border rounded-sm px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 uppercase tracking-[0.15em] text-xs py-3 rounded-sm transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      "Wysyłanie..."
                    ) : (
                      <>
                        <Send size={16} />
                        Wyślij wiadomość
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
