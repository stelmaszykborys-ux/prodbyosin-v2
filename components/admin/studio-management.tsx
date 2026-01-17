"use client"

import { useState } from "react"
import type { StudioItem } from "@/components/studio-grid"
import { Plus, Edit2, Trash2, Eye, EyeOff, Video, ArrowUp, ArrowDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface StudioManagementProps {
  items: StudioItem[]
}

/**
 * Admin component for managing studio items.
 * Allows toggling visibility, editing and deleting items.
 */
export function StudioManagement({ items: initialItems }: StudioManagementProps) {
  const [items, setItems] = useState<StudioItem[]>(initialItems)

  const toggleActive = async (id: string, isActive: boolean) => {
    const response = await fetch("/api/admin/studio/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isActive: !isActive }),
    })

    if (response.ok) {
      setItems(items.map((item) => (item.id === id ? { ...item, is_active: !isActive } : item)))
    }
  }

  const deleteItem = async (id: string) => {
    if (!confirm("Na pewno chcesz usunąć ten element?")) return

    const response = await fetch(`/api/admin/studio/${id}`, { method: "DELETE" })

    if (response.ok) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  const handleReorder = async (id: string, direction: "up" | "down") => {
    const currentIndex = items.findIndex((item) => item.id === id)
    if (currentIndex === -1) return
    if (direction === "up" && currentIndex === 0) return
    if (direction === "down" && currentIndex === items.length - 1) return

    const newItems = [...items]
    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1

    // Optimistic update
    const temp = newItems[currentIndex]
    newItems[currentIndex] = newItems[swapIndex]
    newItems[swapIndex] = temp
    setItems(newItems)

    const response = await fetch("/api/admin/studio/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, direction }),
    })

    if (!response.ok) {
      // Revert on failure
      setItems(items)
      alert("Wystąpił błąd podczas zmiany kolejności.")
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/studio/nowy">
        <button className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-[0.15em] text-xs px-8 py-3 rounded-sm transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Dodaj Materiał
        </button>
      </Link>

      <div className="grid gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-card/30 border border-border/50 rounded-sm p-6 flex items-center gap-6 hover:bg-card/50 transition-colors"
          >
            {/* Preview: show icon depending on type */}
            {item.video_url ? (
              <div className="flex items-center justify-center w-24 h-24 bg-secondary rounded-sm text-primary">
                <Video className="w-8 h-8" />
              </div>
            ) : (
              <div className="relative w-24 h-24 rounded-sm overflow-hidden flex-shrink-0">
                <Image
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.title || "Studio item"}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-primary truncate">{item.title}</h3>
              {item.description && (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{item.description}</p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Utworzony: {item.created_at ? new Date(item.created_at as any).toLocaleDateString("pl-PL") : ""}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Toggle visibility if item has property is_active */}
              {"is_active" in item && (
                <button
                  onClick={() => toggleActive(item.id, (item as any).is_active as any)}
                  className="p-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {(item as any).is_active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              )}

              <div className="flex flex-col gap-1 mx-2">
                <button
                  onClick={() => handleReorder(item.id, "up")}
                  disabled={items.indexOf(item) === 0}
                  className="text-muted-foreground hover:text-primary disabled:opacity-30 transition-colors"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleReorder(item.id, "down")}
                  disabled={items.indexOf(item) === items.length - 1}
                  className="text-muted-foreground hover:text-primary disabled:opacity-30 transition-colors"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>

              <Link href={`/admin/studio/${item.id}`}>
                <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                  <Edit2 className="w-5 h-5" />
                </button>
              </Link>

              <button
                onClick={() => deleteItem(item.id)}
                className="p-2 text-destructive hover:text-destructive/80 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Brak materiałów w studio. Dodaj nowy, aby zacząć.</p>
        </div>
      )}
    </div>
  )
}