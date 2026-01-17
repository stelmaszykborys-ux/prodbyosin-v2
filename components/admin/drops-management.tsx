"use client"

import { useState } from "react"
import type { Drop } from "@/lib/types"
import { Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface DropsManagementProps {
  drops: Drop[]
}

export function DropsManagement({ drops }: DropsManagementProps) {
  const [items, setItems] = useState<Drop[]>(drops)

  const toggleActive = async (id: string, isActive: boolean) => {
    const response = await fetch("/api/admin/drops/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isActive: !isActive }),
    })

    if (response.ok) {
      setItems(items.map((item) => (item.id === id ? { ...item, is_active: !isActive } : item)))
    }
  }

  const deleteDrop = async (id: string) => {
    if (!confirm("Na pewno chcesz usunąć ten drop?")) return

    const response = await fetch(`/api/admin/drops/${id}`, { method: "DELETE" })

    if (response.ok) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/drops/nowy">
        <button className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-[0.15em] text-xs px-8 py-3 rounded-sm transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Dodaj Drop
        </button>
      </Link>

      <div className="grid gap-4">
        {items.map((drop) => (
          <div
            key={drop.id}
            className="bg-card/30 border border-border/50 rounded-sm p-6 flex items-center gap-6 hover:bg-card/50 transition-colors"
          >
            {drop.cover_image_url && (
              <div className="relative w-24 h-24 rounded-sm overflow-hidden flex-shrink-0">
                <Image
                  src={drop.cover_image_url || "/placeholder.svg"}
                  alt={drop.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-primary truncate">{drop.title}</h3>
              {drop.description && (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{drop.description}</p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Utworzony: {new Date(drop.created_at).toLocaleDateString("pl-PL")}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => toggleActive(drop.id, drop.is_active)}
                className="p-2 text-muted-foreground hover:text-primary transition-colors"
              >
                {drop.is_active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>

              <Link href={`/admin/drops/${drop.id}`}>
                <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                  <Edit2 className="w-5 h-5" />
                </button>
              </Link>

              <button
                onClick={() => deleteDrop(drop.id)}
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
          <p className="text-muted-foreground">Brak drop'ów. Dodaj pierwszy drop aby zacząć.</p>
        </div>
      )}
    </div>
  )
}
