"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface StudioFormProps {
  item?: any
}

/**
 * Form for creating and editing studio items.
 * Allows setting title, description, image URL and video URL, plus visibility.
 */
export function StudioForm({ item }: StudioFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    title: item?.title || "",
    description: item?.description || "",
    image_url: item?.image_url || "",
    video_url: item?.video_url || "",
    is_active: item?.is_active ?? true,
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
      const filePath = `studio/${fileName}`

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

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const endpoint = item ? `/api/admin/studio/${item.id}` : "/api/admin/studio"
      const method = item ? "PUT" : "POST"
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Nie udało się zapisać materiału")

      router.push("/admin/studio")
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
        <label className="text-sm font-semibold text-primary">Zdjęcie</label>
        <div className="flex items-center gap-4">
          <div className="w-32 h-20 bg-card/50 rounded-sm overflow-hidden flex items-center justify-center border border-border/50 relative group">
            {formData.image_url ? (
              <>
                <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
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
              Wybierz plik
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-primary">URL Wideo</label>
        <input
          type="url"
          name="video_url"
          value={formData.video_url}
          onChange={handleChange}
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
        {loading ? "Zapisywanie..." : "Zapisz"}
      </button>
    </form>
  )
}