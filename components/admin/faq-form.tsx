"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { AdminFAQItem } from "./faq-management"

interface FAQFormProps {
  /** Existing FAQ item; if provided, the form edits instead of creating */
  item?: AdminFAQItem
}

/**
 * Form component for creating and editing FAQ items in the admin panel.
 * Supports editing existing items when the `item` prop is passed.
 */
export function FAQForm({ item }: FAQFormProps) {
  const router = useRouter()
  const [question, setQuestion] = useState(item?.question || "")
  const [answer, setAnswer] = useState(item?.answer || "")
  const [category, setCategory] = useState<AdminFAQItem["category"]>(
    (item?.category as any) || "general",
  )
  const [isPublished, setIsPublished] = useState<boolean>(item?.is_published ?? true)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        question,
        answer,
        category,
        is_published: isPublished,
      }
      if (item) {
        // update existing
        await fetch(`/api/admin/faq/${item.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      } else {
        // create new
        await fetch("/api/admin/faq", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      }
      router.push("/admin/faq")
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="question" className="block text-sm font-medium mb-1 text-muted-foreground">
          Pytanie
        </label>
        <input
          type="text"
          id="question"
          required
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full bg-card/30 border border-border/50 rounded-sm px-4 py-3 text-foreground focus:outline-none focus:border-primary/50"
        />
      </div>
      <div>
        <label htmlFor="answer" className="block text-sm font-medium mb-1 text-muted-foreground">
          Odpowiedź
        </label>
        <textarea
          id="answer"
          rows={6}
          required
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full bg-card/30 border border-border/50 rounded-sm px-4 py-3 text-foreground focus:outline-none focus:border-primary/50"
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1 text-muted-foreground">
          Kategoria
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as any)}
          className="w-full bg-card/30 border border-border/50 rounded-sm px-4 py-3 text-foreground focus:outline-none focus:border-primary/50"
        >
          <option value="pricing">Ceny</option>
          <option value="licenses">Licencje</option>
          <option value="general">Ogólne</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="published"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="published" className="text-sm text-muted-foreground">
          Opublikowane
        </label>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-[0.15em] text-sm font-semibold px-8 py-3 rounded-sm transition-colors"
      >
        {loading ? "Zapisywanie..." : item ? "Zapisz zmiany" : "Dodaj pytanie"}
      </button>
    </form>
  )
}