"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, ImageIcon, Music, Trash2, Copy, Check } from "lucide-react"

export default function AdminMediaPage() {
  const [copied, setCopied] = useState<string | null>(null)

  // Placeholder media items
  const mediaItems = [
    { id: "1", type: "image", name: "cover-midnight.jpg", url: "/placeholder.svg?height=200&width=200" },
    { id: "2", type: "image", name: "cover-street.jpg", url: "/placeholder.svg?height=200&width=200" },
    { id: "3", type: "audio", name: "midnight-preview.mp3", url: "#" },
  ]

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-primary">Media</h1>
          <p className="text-muted-foreground">Zarządzaj plikami multimedialnymi</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Upload size={16} className="mr-2" />
          Dodaj plik
        </Button>
      </div>

      {/* Upload Area */}
      <Card className="bg-card/50 border-border/50 border-dashed">
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto">
              <Upload size={24} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm">Przeciągnij pliki tutaj lub</p>
              <Button variant="link" className="text-primary">
                wybierz z dysku
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Obsługiwane formaty: JPG, PNG, MP3, WAV (max 50MB)</p>
          </div>
        </CardContent>
      </Card>

      {/* Media Grid */}
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mediaItems.map((item) => (
          <Card key={item.id} className="bg-card/50 border-border/50 overflow-hidden group">
            <div className="aspect-square bg-secondary relative">
              {item.type === "image" ? (
                <img src={item.url || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music size={48} className="text-muted-foreground" />
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button size="icon" variant="outline" onClick={() => handleCopy(item.url)} className="bg-background/50">
                  {copied === item.url ? <Check size={16} /> : <Copy size={16} />}
                </Button>
                <Button size="icon" variant="outline" className="text-destructive bg-background/50">
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
            <CardContent className="p-3">
              <p className="text-sm truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{item.type}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {mediaItems.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
          <p>Brak plików multimedialnych</p>
        </div>
      )}
    </div>
  )
}
