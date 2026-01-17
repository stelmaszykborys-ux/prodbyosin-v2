"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, ArrowLeft, Loader2, Upload, X, Music, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import type { Beat } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"

interface BeatFormProps {
  beat?: Beat
}

// Fixed license prices (PLN) required by PRODBYOSIN.
const FIXED_LICENSE_PRICES = {
  mp3: 150,
  wav: 300,
  stems: 500, // Exclusive
} as const

const GENRES = ["Trap", "Boom Bap", "Drill", "Pop Rap", "Synth Trap", "R&B", "Lo-Fi", "Afrobeats"]
const MOODS = [
  "Melancholijny",
  "Energiczny",
  "Agresywny",
  "Pozytywny",
  "Nostalgiczny",
  "Futurystyczny",
  "Romantyczny",
  "Mroczny",
]
const KEYS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "Am", "Bm", "Cm", "Dm", "Em", "Fm", "Gm"]

export function BeatForm({ beat }: BeatFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // File states
  const [uploading, setUploading] = useState(false)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const previewInputRef = useRef<HTMLInputElement>(null)
  const fullInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    title: beat?.title || "",
    slug: beat?.slug || "",
    description: beat?.description || "",
    bpm: beat?.bpm?.toString() || "",
    key: beat?.key || "",
    genre: beat?.genre || "",
    mood: beat?.mood || "",
    tags: beat?.tags?.join(", ") || "",
    audio_preview_url: beat?.audio_preview_url || "",
    audio_full_url: beat?.audio_full_url || "",
    cover_image_url: beat?.cover_image_url || "",
    // Prices are fixed and not editable in the admin.
    price_mp3: FIXED_LICENSE_PRICES.mp3.toString(),
    price_wav: FIXED_LICENSE_PRICES.wav.toString(),
    price_stems: FIXED_LICENSE_PRICES.stems.toString(),
    is_published: beat?.is_published ?? true,
    is_featured: beat?.is_featured ?? false,
    is_sold: beat?.is_sold ?? false,
  })

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[ąàáâãäå]/g, "a")
      .replace(/[ćčç]/g, "c")
      .replace(/[ęèéêë]/g, "e")
      .replace(/[ìíîï]/g, "i")
      .replace(/[łľ]/g, "l")
      .replace(/[ńñ]/g, "n")
      .replace(/[óòôõö]/g, "o")
      .replace(/[śšş]/g, "s")
      .replace(/[ùúûü]/g, "u")
      .replace(/[ýÿ]/g, "y")
      .replace(/[żźž]/g, "z")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  const handleTitleChange = (value: string) => {
    setFormData({
      ...formData,
      title: value,
      slug: beat ? formData.slug : generateSlug(value),
    })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, bucket: string, field: "cover_image_url" | "audio_preview_url" | "audio_full_url") => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const supabase = createClient()
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)

      setFormData(prev => ({ ...prev, [field]: data.publicUrl }))
    } catch (err: unknown) {
      console.error("Upload error:", err)
      setError("Błąd podczas przesyłania pliku. Sprawdź czy jesteś zalogowany i masz uprawnienia.")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    const beatData = {
      title: formData.title,
      slug: formData.slug,
      description: formData.description || null,
      bpm: formData.bpm ? Number.parseInt(formData.bpm) : null,
      key: formData.key || null,
      genre: formData.genre || null,
      mood: formData.mood || null,
      tags: formData.tags
        ? formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
        : null,
      audio_preview_url: formData.audio_preview_url || null,
      audio_full_url: formData.audio_full_url || null,
      cover_image_url: formData.cover_image_url || null,
      // Prices are fixed (stored in grosze).
      price_mp3: FIXED_LICENSE_PRICES.mp3 * 100,
      price_wav: FIXED_LICENSE_PRICES.wav * 100,
      price_stems: FIXED_LICENSE_PRICES.stems * 100,
      is_published: formData.is_published,
      is_featured: formData.is_featured,
      // `is_sold` should be set automatically after an exclusive purchase.
      is_sold: beat ? formData.is_sold : false,
    }

    try {
      if (beat) {
        const { error } = await supabase.from("beats").update(beatData).eq("id", beat.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("beats").insert(beatData)
        if (error) throw error
      }

      router.push("/admin/beaty")
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Wystąpił błąd")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Back link */}
      <Link href="/admin/beaty" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft size={16} className="mr-2" />
        Powrót do listy
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Podstawowe informacje</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Tytuł *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    required
                    placeholder="np. Midnight Dreams"
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL) *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    placeholder="midnight-dreams"
                    className="bg-background/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Opis</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Opisz beat, jego klimat i potencjalne zastosowanie..."
                  rows={4}
                  className="bg-background/50 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bpm">BPM</Label>
                  <Input
                    id="bpm"
                    type="number"
                    value={formData.bpm}
                    onChange={(e) => setFormData({ ...formData, bpm: e.target.value })}
                    placeholder="140"
                    min={60}
                    max={300}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="key">Tonacja</Label>
                  <Select value={formData.key} onValueChange={(value) => setFormData({ ...formData, key: value })}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Wybierz" />
                    </SelectTrigger>
                    <SelectContent>
                      {KEYS.map((k) => (
                        <SelectItem key={k} value={k}>
                          {k}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="genre">Gatunek</Label>
                  <Select value={formData.genre} onValueChange={(value) => setFormData({ ...formData, genre: value })}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Wybierz" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENRES.map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mood">Nastrój</Label>
                  <Select value={formData.mood} onValueChange={(value) => setFormData({ ...formData, mood: value })}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Wybierz" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOODS.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tagi (oddzielone przecinkami)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="trap, melodic, dark, atmospheric"
                  className="bg-background/50"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Cover Image */}
              <div className="space-y-4">
                <Label>Okładka</Label>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-32 bg-secondary rounded-sm flex items-center justify-center overflow-hidden border border-border/50 relative group">
                    {formData.cover_image_url ? (
                      <>
                        <img
                          src={formData.cover_image_url}
                          alt="Cover"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, cover_image_url: "" })}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                        >
                          <X size={24} />
                        </button>
                      </>
                    ) : (
                      <ImageIcon className="text-muted-foreground opacity-50" size={32} />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => coverInputRef.current?.click()}
                        disabled={uploading}
                      >
                        {uploading ? <Loader2 className="animate-spin mr-2" size={16} /> : <Upload className="mr-2" size={16} />}
                        Prześlij obraz
                      </Button>
                      <Input
                        placeholder="Lub wklej URL..."
                        value={formData.cover_image_url}
                        onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                        className="bg-background/50 flex-1"
                      />
                    </div>
                    <input
                      type="file"
                      ref={coverInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "beats", "cover_image_url")}
                    />
                    <p className="text-xs text-muted-foreground">Zalecany format: kwadrat, min. 1000x1000px</p>
                  </div>
                </div>
              </div>

              {/* Audio Preview */}
              <div className="space-y-4">
                <Label>Podgląd Audio (MP3)</Label>
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-secondary rounded-sm flex items-center justify-center shrink-0">
                    <Music className="text-primary" size={24} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => previewInputRef.current?.click()}
                        disabled={uploading}
                      >
                        {uploading ? <Loader2 className="animate-spin mr-2" size={16} /> : <Upload className="mr-2" size={16} />}
                        Prześlij MP3
                      </Button>
                      <Input
                        placeholder="Lub wklej URL..."
                        value={formData.audio_preview_url}
                        onChange={(e) => setFormData({ ...formData, audio_preview_url: e.target.value })}
                        className="bg-background/50 flex-1"
                      />
                    </div>
                    <input
                      type="file"
                      ref={previewInputRef}
                      className="hidden"
                      accept="audio/mpeg,audio/mp3"
                      onChange={(e) => handleFileUpload(e, "beats", "audio_preview_url")}
                    />
                  </div>
                </div>
              </div>

              {/* Full Audio */}
              <div className="space-y-4">
                <Label>Pełny plik (WAV/ZIP)</Label>
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-secondary rounded-sm flex items-center justify-center shrink-0">
                    <Music className="text-muted-foreground" size={24} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fullInputRef.current?.click()}
                        disabled={uploading}
                      >
                        {uploading ? <Loader2 className="animate-spin mr-2" size={16} /> : <Upload className="mr-2" size={16} />}
                        Prześlij plik
                      </Button>
                      <Input
                        placeholder="Lub wklej URL..."
                        value={formData.audio_full_url}
                        onChange={(e) => setFormData({ ...formData, audio_full_url: e.target.value })}
                        className="bg-background/50 flex-1"
                      />
                    </div>
                    <input
                      type="file"
                      ref={fullInputRef}
                      className="hidden"
                      accept=".wav,.zip,.rar,.mp3"
                      onChange={(e) => handleFileUpload(e, "beats", "audio_full_url")}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Licencje (ceny stałe)</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="rounded-md border border-border/50 bg-background/30 p-3">
                <div className="font-medium">Basic Lease</div>
                <div className="text-muted-foreground">MP3 • Komercyjnie</div>
                <div className="mt-2 text-primary font-semibold">{FIXED_LICENSE_PRICES.mp3} PLN</div>
              </div>
              <div className="rounded-md border border-border/50 bg-background/30 p-3">
                <div className="font-medium">Premium Lease</div>
                <div className="text-muted-foreground">WAV + STEMS</div>
                <div className="mt-2 text-primary font-semibold">{FIXED_LICENSE_PRICES.wav} PLN</div>
              </div>
              <div className="rounded-md border border-border/50 bg-background/30 p-3">
                <div className="font-medium">Exclusive</div>
                <div className="text-muted-foreground">Wyłączność • znika ze sklepu</div>
                <div className="mt-2 text-primary font-semibold">{FIXED_LICENSE_PRICES.stems} PLN</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="is_published">Opublikowany</Label>
                  <p className="text-xs text-muted-foreground">Beat będzie widoczny w sklepie</p>
                </div>
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="is_featured">Wyróżniony</Label>
                  <p className="text-xs text-muted-foreground">Pokaż na stronie głównej</p>
                </div>
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="is_sold">Sprzedany (exclusive)</Label>
                  <p className="text-xs text-muted-foreground">
                    Beat jest oznaczany jako sprzedany automatycznie po zakupie licencji Exclusive.
                  </p>
                </div>
                <Switch
                  id="is_sold"
                  checked={formData.is_sold}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_sold: checked })}
                  disabled={!beat}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-6">
              {error && <p className="text-sm text-destructive mb-4">{error}</p>}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Zapisywanie...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    {beat ? "Zapisz zmiany" : "Dodaj beat"}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
