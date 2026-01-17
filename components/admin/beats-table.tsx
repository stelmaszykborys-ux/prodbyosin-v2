"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit, Trash2, Eye, Star, StarOff, EyeOff, Search, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Beat } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"

interface BeatsTableProps {
  beats: Beat[]
}

export function BeatsTable({ beats: initialBeats }: BeatsTableProps) {
  const [beats, setBeats] = useState(initialBeats)
  const [search, setSearch] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const router = useRouter()

  const filteredBeats = beats.filter(
    (beat) =>
      beat.title.toLowerCase().includes(search.toLowerCase()) ||
      beat.genre?.toLowerCase().includes(search.toLowerCase()),
  )

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(priceInCents / 100)
  }

  const handleToggleFeatured = async (beat: Beat) => {
    const supabase = createClient()
    const { error } = await supabase.from("beats").update({ is_featured: !beat.is_featured }).eq("id", beat.id)

    if (!error) {
      setBeats(beats.map((b) => (b.id === beat.id ? { ...b, is_featured: !b.is_featured } : b)))
    }
  }

  const handleTogglePublished = async (beat: Beat) => {
    const supabase = createClient()
    const { error } = await supabase.from("beats").update({ is_published: !beat.is_published }).eq("id", beat.id)

    if (!error) {
      setBeats(beats.map((b) => (b.id === beat.id ? { ...b, is_published: !b.is_published } : b)))
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    const supabase = createClient()
    const { error } = await supabase.from("beats").delete().eq("id", deleteId)

    if (!error) {
      setBeats(beats.filter((b) => b.id !== deleteId))
    }
    setDeleteId(null)
  }

  return (
    <>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          placeholder="Szukaj beatów..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-card/50 border-border/50"
        />
      </div>

      {/* Table */}
      <Card className="bg-card/50 border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  Beat
                </th>
                <th className="text-left p-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  BPM / Key
                </th>
                <th className="text-left p-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  Gatunek
                </th>
                <th className="text-left p-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  Cena MP3
                </th>
                <th className="text-left p-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  Status
                </th>
                <th className="text-right p-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  Akcje
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBeats.map((beat) => (
                <tr key={beat.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-secondary rounded-sm flex items-center justify-center flex-shrink-0">
                        {beat.cover_image_url ? (
                          <img
                            src={beat.cover_image_url || "/placeholder.svg"}
                            alt={beat.title}
                            className="w-full h-full object-cover rounded-sm"
                          />
                        ) : (
                          <span className="font-serif text-xl text-primary/30">O</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{beat.title}</p>
                        <p className="text-xs text-muted-foreground">{beat.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {beat.bpm} BPM • {beat.key}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{beat.genre}</td>
                  <td className="p-4 text-sm">{formatPrice(beat.price_mp3)}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {beat.is_featured && (
                        <span className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded">Wyróżniony</span>
                      )}
                      {beat.is_published ? (
                        <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded">Publiczny</span>
                      ) : (
                        <span className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded">Szkic</span>
                      )}
                      {beat.is_sold && (
                        <span className="text-xs bg-red-500/10 text-red-500 px-2 py-0.5 rounded">Sprzedany</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/beaty/${beat.id}`}>
                            <Edit size={14} className="mr-2" />
                            Edytuj
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/sklep/${beat.slug}`} target="_blank">
                            <Eye size={14} className="mr-2" />
                            Podgląd
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleToggleFeatured(beat)}>
                          {beat.is_featured ? (
                            <>
                              <StarOff size={14} className="mr-2" />
                              Usuń wyróżnienie
                            </>
                          ) : (
                            <>
                              <Star size={14} className="mr-2" />
                              Wyróżnij
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTogglePublished(beat)}>
                          {beat.is_published ? (
                            <>
                              <EyeOff size={14} className="mr-2" />
                              Ukryj
                            </>
                          ) : (
                            <>
                              <Eye size={14} className="mr-2" />
                              Opublikuj
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeleteId(beat.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 size={14} className="mr-2" />
                          Usuń
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBeats.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {search ? "Nie znaleziono beatów" : "Brak beatów w katalogu"}
          </div>
        )}
      </Card>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Czy na pewno chcesz usunąć ten beat?</AlertDialogTitle>
            <AlertDialogDescription>
              Ta akcja jest nieodwracalna. Beat zostanie trwale usunięty z bazy danych.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Usuń
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
