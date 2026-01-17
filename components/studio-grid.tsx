import Image from "next/image"

export interface StudioItem {
  id: string
  title: string
  description?: string | null
  image_url?: string | null
  video_url?: string | null
  created_at?: string | null
  is_active?: boolean | null
}

interface StudioGridProps {
  items: StudioItem[]
}

function getEmbedUrl(url: string | null): string | null {
  if (!url) return null

  // YouTube
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&]+)/)
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`

  return null
}

/**
 * Displays a responsive grid of studio items. Supports Images, direct Video files, and YouTube/Vimeo embeds.
 */
export function StudioGrid({ items }: StudioGridProps) {
  if (!items || items.length === 0) {
    return <p className="text-muted-foreground">Brak materiałów w studio.</p>
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const embedUrl = getEmbedUrl(item.video_url || null)

        return (
          <div
            key={item.id}
            className="bg-card/40 border border-border/50 rounded-sm overflow-hidden shadow-md hover:shadow-lg transition-shadow group"
          >
            {item.video_url ? (
              embedUrl ? (
                // YouTube / Vimeo Embed
                <div className="relative w-full h-64 bg-black">
                  <iframe
                    src={embedUrl}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              ) : (
                // Direct Video File
                <video
                  src={item.video_url}
                  controls
                  className="w-full h-64 object-cover bg-black"
                  preload="metadata"
                />
              )
            ) : (
              // Image
              <div className="relative w-full h-64">
                <Image
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.title || "Studio item"}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )}

            <div className="p-4 space-y-2">
              <h3 className="text-2xl font-semibold text-primary">{item.title}</h3>
              {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
            </div>
          </div>
        )
      })}
    </div>
  )
}