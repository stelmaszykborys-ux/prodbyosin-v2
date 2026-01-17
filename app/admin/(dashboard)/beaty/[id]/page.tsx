import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BeatForm } from "@/components/admin/beat-form"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditBeatPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: beat, error } = await supabase.from("beats").select("*").eq("id", id).single()

  if (error || !beat) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-primary">Edytuj Beat</h1>
        <p className="text-muted-foreground">Aktualizuj informacje o beacie "{beat.title}"</p>
      </div>

      <BeatForm beat={beat} />
    </div>
  )
}
