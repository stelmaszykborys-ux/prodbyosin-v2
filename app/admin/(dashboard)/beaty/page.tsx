import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { BeatsTable } from "@/components/admin/beats-table"

export default async function AdminBeatsPage() {
  const supabase = await createClient()

  const { data: beats, error } = await supabase.from("beats").select("*").order("created_at", { ascending: false })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-primary">Beaty</h1>
          <p className="text-muted-foreground">Zarządzaj swoim katalogiem beatów</p>
        </div>
        <Link href="/admin/beaty/nowy">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus size={16} className="mr-2" />
            Dodaj Beat
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50 p-4">
          <p className="text-2xl font-light text-primary">{beats?.length || 0}</p>
          <p className="text-xs text-muted-foreground">Wszystkie</p>
        </Card>
        <Card className="bg-card/50 border-border/50 p-4">
          <p className="text-2xl font-light text-primary">{beats?.filter((b) => b.is_published).length || 0}</p>
          <p className="text-xs text-muted-foreground">Opublikowane</p>
        </Card>
        <Card className="bg-card/50 border-border/50 p-4">
          <p className="text-2xl font-light text-primary">{beats?.filter((b) => b.is_featured).length || 0}</p>
          <p className="text-xs text-muted-foreground">Wyróżnione</p>
        </Card>
        <Card className="bg-card/50 border-border/50 p-4">
          <p className="text-2xl font-light text-primary">{beats?.filter((b) => b.is_sold).length || 0}</p>
          <p className="text-xs text-muted-foreground">Sprzedane</p>
        </Card>
      </div>

      {/* Beats Table */}
      <BeatsTable beats={beats || []} />
    </div>
  )
}
