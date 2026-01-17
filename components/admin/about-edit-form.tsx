"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface AboutEditFormProps {
  initialData?: any
}

export function AboutEditForm({ initialData }: AboutEditFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    title: initialData?.title || "O mnie",
    subtitle: initialData?.subtitle || "Producent Muzyczny",
    description: initialData?.description || "",
    image_url: initialData?.image_url || "",
    stats: initialData?.stats || [],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)
    const supabase = createClient()

    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      const filePath = `about/${fileName}`

      const { error: uploadError } = await supabase.storage.from("public").upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from("public").getPublicUrl(filePath)
      setFormData((prev) => ({ ...prev, image_url: data.publicUrl }))
    } catch (err: unknown) {
      console.error(err)
      setError("Błąd podczas przesyłania zdjęcia.")
    } finally {
      setUploading(false)
    }
  }

  const handleStatChange = (index: number, field: string, value: string) => {
    const newStats = [...formData.stats]
    newStats[index] = { ...newStats[index], [field]: value }
    setFormData((prev) => ({ ...prev, stats: newStats }))
  }

  const addStat = () => {
    setFormData((prev) => ({
      ...prev,
      stats: [...prev.stats, { label: "", value: "" }],
    }))
  }

  const removeStat = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      stats: prev.stats.filter((_: any, i: number) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/settings/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Nie udało się zapisać zmian")

      router.refresh()
      alert("Strona 'O mnie' została zaktualizowana!")
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
        <label className="text-sm font-semibold text-primary">Opis (można użyć Enter do paragrafów)</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={8}
          className="w-full bg-card/30 border border-border/50 rounded-sm px-4 py-3 text-foreground focus:outline-none focus:border-primary/50"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-primary">Zdjęcie profilowe</label>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 bg-card/50 rounded-sm overflow-hidden flex items-center justify-center border border-border/50 relative group">
            {formData.image_url ? (
              <>
                <img src={formData.image_url} alt="Profile" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, image_url: "" }))}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                >
                  <X size={20} />
                </button>
              </>
            ) : (
              <ImageIcon className="text-muted-foreground opacity-50" size={24} />
            )}
          </div>
          <div className="flex-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center justify-center rounded-sm text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
            >
              {uploading ? <Loader2 className="animate-spin mr-2" size={16} /> : <Upload className="mr-2" size={16} />}
              Wybierz zdjęcie
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <p className="text-xs text-muted-foreground mt-2">Zalecane: Portret pionowy</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-primary">Statystyki</label>
          <button
            type="button"
            onClick={addStat}
            className="text-xs text-accent hover:text-accent/80 uppercase tracking-wider"
          >
            + Dodaj statystykę
          </button>
        </div>

        <div className="space-y-3">
          {formData.stats.map((stat: any, index: number) => (
            <div key={index} className="flex gap-3">
              <input
                type="text"
                placeholder="Etykieta (np. Lat doświadczenia)"
                value={stat.label}
                onChange={(e) => handleStatChange(index, "label", e.target.value)}
                className="flex-1 bg-card/30 border border-border/50 rounded-sm px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
              />
              <input
                type="text"
                placeholder="Wartość (np. 5+)"
                value={stat.value}
                onChange={(e) => handleStatChange(index, "value", e.target.value)}
                className="flex-1 bg-card/30 border border-border/50 rounded-sm px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
              />
              <button
                type="button"
                onClick={() => removeStat(index)}
                className="text-destructive hover:text-destructive/80"
              >
                Usuń
              </button>
            </div>
          ))}
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
