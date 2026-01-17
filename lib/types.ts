export interface Beat {
  id: string
  title: string
  slug: string
  description: string | null
  bpm: number | null
  key: string | null
  genre: string | null
  mood: string | null
  tags: string[] | null
  audio_preview_url: string | null
  audio_full_url: string | null
  cover_image_url: string | null
  price_mp3: number
  price_wav: number
  price_stems: number
  is_sold: boolean
  is_featured: boolean
  is_published: boolean
  plays_count: number
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  beat_id: string | null
  user_id: string | null
  customer_email: string
  customer_name: string | null
  license_type: "mp3" | "wav" | "stems"
  price_paid: number
  stripe_payment_id: string | null
  stripe_session_id: string | null
  status: "pending" | "completed" | "failed" | "refunded"
  download_url: string | null
  download_count: number
  created_at: string
  beat?: Beat
}

export interface SiteSettings {
  id: string
  key: string
  value: Record<string, unknown>
  updated_at: string
}

export interface Drop {
  id: string
  title: string
  slug: string
  description: string | null
  cover_image_url: string | null
  background_image_url: string | null
  background_color: string
  is_active: boolean
  order_index: number
  release_date: string | null
  created_at: string
  updated_at: string
  beat_count?: number
  genre?: string
}

export interface DropBeat {
  id: string
  drop_id: string
  beat_id: string
  order_index: number
  beat?: Beat
}

export interface StaticPackage {
  id: string
  title: string
  description: string | null
  cover_image_url: string | null
  background_image_url: string | null
  background_color: string
  updated_at: string
}

export interface CartItem {
  id: string
  session_id: string
  beat_id: string
  license_type: "mp3" | "wav" | "stems"
  price: number
  beat?: Beat
}

export type LicenseType = "mp3" | "wav" | "stems"

export const LICENSE_NAMES: Record<LicenseType, string> = {
  mp3: "Licencja MP3",
  wav: "Licencja WAV",
  stems: "Licencja Stems",
}

export const LICENSE_FEATURES: Record<LicenseType, string[]> = {
  mp3: ["Plik MP3 320kbps", "Do użytku niekomercyjnego", "Streaming bez limitu", "Kredyt dla producenta"],
  wav: [
    "Plik WAV 24-bit",
    "Do użytku komercyjnego",
    "Do 500,000 streamów",
    "1 teledysk muzyczny",
    "Kredyt dla producenta",
  ],
  stems: [
    "Wszystkie ścieżki (stems)",
    "Pełne prawa komercyjne",
    "Nieograniczone streamy",
    "Nieograniczone teledyski",
    "Możliwość modyfikacji",
  ],
}
