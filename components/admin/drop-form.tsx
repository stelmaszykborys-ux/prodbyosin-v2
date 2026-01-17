"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export function DropForm({ drop }: { drop?: any } = {}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: drop?.title || "",
    slug: drop?.slug || "",
    description: drop?.description || "",
    background_color: drop?.background_color || "#0a0a0a",
    cover_image_url: drop?.cover_image_url || "",
    background_image_url: drop?.background_image_url || "",
    price: drop?.price ? (drop.price / 100).toString() : "",
    buy_url: drop?.buy_url || "",
    is_active: drop?.is_active ?? true,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const endpoint = drop ? `/api/admin/drops/${drop.id}` : "/api/admin/drops"
      const method = drop ? "PUT" : "POST"

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: formData.price ? Math.round(parseFloat(formData.price) * 100) : null,
        }),
      })

      if (!response.ok) throw new Error("Nie udało się zapisać drop'a")

      router.push("/admin/drops")
      router.refresh()
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
        <label className="text-sm font-semibold text-primary">Slug</label>
        <input
          type="text"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          required
          className="w-full bg-card/30 border border-border/50 rounded-sm px-4 py-3 text-foreground focus:outline-none focus:border-primary/50"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-primary">Opis</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full bg-card/30 border border-border/50 rounded-sm px-4 py-3 text-foreground focus:outline-none focus:border-primary/50"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-primary">URL Okładki</label>
        <input
          type="url"
          name="cover_image_url"
          value={formData.cover_image_url}
          onChange={handleChange}
          className="w-full bg-card/30 border border-border/50 rounded-sm px-4 py-3 text-foreground focus:outline-none focus:border-primary/50"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-primary">URL Tła</label>
        <input
          type="url"
          name="background_image_url"
          value={formData.background_image_url}
          onChange={handleChange}
          className="w-full bg-card/30 border border-border/50 rounded-sm px-4 py-3 text-foreground focus:outline-none focus:border-primary/50"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-primary">Cena (PLN)</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="np. 49.99"
          className="w-full bg-card/30 border border-border/50 rounded-sm px-4 py-3 text-foreground focus:outline-none focus:border-primary/50"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-primary">Link do zakupu / strony</label>
        <input
          type="url"
          name="buy_url"
          value={formData.buy_url}
          onChange={handleChange}
          placeholder="https://..."
          className="w-full bg-card/30 border border-border/50 rounded-sm px-4 py-3 text-foreground focus:outline-none focus:border-primary/50"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-primary">Kolor Tła (hex)</label>
        <input
          type="text"
          name="background_color"
          value={formData.background_color}
          onChange={handleChange}
          placeholder="#0a0a0a"
          className="w-full bg-card/30 border border-border/50 rounded-sm px-4 py-3 text-foreground focus:outline-none focus:border-primary/50"
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="is_active"
          id="is_active"
          checked={formData.is_active}
          onChange={handleToggle}
          className="w-4 h-4"
        />
        <label htmlFor="is_active" className="text-sm text-foreground cursor-pointer">
          Aktywny
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 uppercase tracking-[0.15em] text-xs py-3 rounded-sm transition-colors font-semibold flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? "Zapisywanie..." : "Zapisz Drop"}
      </button>
    </form>
  )
}
