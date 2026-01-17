"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface ContactEditFormProps {
  initialData?: any
}

export function ContactEditForm({ initialData }: ContactEditFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: initialData?.title || "Kontakt",
    subtitle: initialData?.subtitle || "Skontaktuj się",
    description: initialData?.description || "",
    email: initialData?.email || "kontakt@prodbyosin.pl",
    instagram: initialData?.instagram || "@prodbyosin",
    instagram_url: initialData?.instagram_url || "",
    youtube: initialData?.youtube || "prodbyosin",
    youtube_url: initialData?.youtube_url || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/settings/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Nie udało się zapisać zmian")

      router.refresh()
      alert("Strona 'Kontakt' została zaktualizowana!")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd serwera")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card/30 border border-border/50 rounded-sm p-8">
      {error && (
        <div className="bg-destructive/10 border border-destructive/50 text-destructive p-4 rounded-sm text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-semibold text-primary">Tytuł</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full bg-card/30 border border-border/50 rounded-sm px-4 py-3 text-foreground focus:outline-none focus:border-primary/50"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-primary">Podtytuł</label>
        <input
          type="text"
          name="subtitle"
          value={formData.subtitle}
          onChange={handleChange}
          className="w-full bg-card/30 border border-border/50 rounded-sm px-4 py-3 text-foreground focus:outline-none focus:border-primary/50"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-primary">Opis strony</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full bg-card/30 border border-border/50 rounded-sm px-4 py-3 text-foreground focus:outline-none focus:border-primary/50"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-primary">Dane kontaktowe</h3>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-primary">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-card/30 border border-border/50 rounded-sm px-4 py-3 text-foreground focus:outline-none focus:border-primary/50"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-primary">Media społecznościowe</h3>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Instagram</label>
          <input
            type="text"
            name="instagram"
            value={formData.instagram}
            onChange={handleChange}
            placeholder="@username"
            className="w-full bg-card/30 border border-border/50 rounded-sm px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
          />
          <input
            type="url"
            name="instagram_url"
            value={formData.instagram_url}
            onChange={handleChange}
            placeholder="https://instagram.com/..."
            className="w-full bg-card/30 border border-border/50 rounded-sm px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">YouTube</label>
          <input
            type="text"
            name="youtube"
            value={formData.youtube}
            onChange={handleChange}
            placeholder="Channel name"
            className="w-full bg-card/30 border border-border/50 rounded-sm px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
          />
          <input
            type="url"
            name="youtube_url"
            value={formData.youtube_url}
            onChange={handleChange}
            placeholder="https://youtube.com/..."
            className="w-full bg-card/30 border border-border/50 rounded-sm px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 text-sm"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 uppercase tracking-[0.15em] text-xs py-3 rounded-sm transition-colors font-semibold flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? "Zapisywanie..." : "Zapisz zmiany"}
      </button>
    </form>
  )
}
