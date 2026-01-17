import { BeatForm } from "@/components/admin/beat-form"

export default function NewBeatPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-primary">Nowy Beat</h1>
        <p className="text-muted-foreground">Dodaj nowy beat do swojego katalogu</p>
      </div>

      <BeatForm />
    </div>
  )
}
