"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

/**
 * FAQ management component for the admin panel.
 * Allows admins to create, edit, delete and toggle the publication status of FAQ items.
 */
export interface AdminFAQItem {
  id: string
  question: string
  answer: string
  category: "pricing" | "licenses" | "general"
  is_published: boolean | null
  order_index?: number | null
}

interface FAQManagementProps {
  items: AdminFAQItem[]
}

export function FAQManagement({ items: initialItems }: FAQManagementProps) {
  const [items, setItems] = useState<AdminFAQItem[]>(initialItems)

  // Toggle publication status for a specific FAQ item
  const togglePublish = async (id: string, isPublished: boolean | null) => {
    const response = await fetch("/api/admin/faq/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isPublished: !isPublished }),
    })

    if (response.ok) {
      setItems(
        items.map((item) => (item.id === id ? { ...item, is_published: !isPublished } : item)),
      )
    }
  }

  // Delete a FAQ item
  const deleteItem = async (id: string) => {
    if (!confirm("Na pewno chcesz usunąć to pytanie?")) return

    const response = await fetch(`/api/admin/faq/${id}`, { method: "DELETE" })

    if (response.ok) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/faq/nowe">
        <button className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-[0.15em] text-xs px-8 py-3 rounded-sm transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Dodaj pytanie
        </button>
      </Link>

      <div className="grid gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-card/30 border border-border/50 rounded-sm p-6 flex items-start gap-6 hover:bg-card/50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-primary break-all">
                {item.question}
              </h3>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {item.answer}
              </p>
              <p className="text-xs text-muted-foreground mt-2 capitalize">
                Kategoria: {item.category}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Toggle publication status */}
              <button
                onClick={() => togglePublish(item.id, item.is_published)}
                className="p-2 text-muted-foreground hover:text-primary transition-colors"
              >
                {item.is_published ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>

              {/* Edit link */}
              <Link href={`/admin/faq/${item.id}`}>
                <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                  <Edit2 className="w-5 h-5" />
                </button>
              </Link>

              {/* Delete */}
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
          <p className="text-muted-foreground">Brak pytań FAQ. Dodaj nowe, aby zacząć.</p>
        </div>
      )}
    </div>
  )
}