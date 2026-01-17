import { createAdminClient } from "@/lib/supabase/admin"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { DropBeatsList } from "@/components/drop-beats-list"

interface DropBeatsPageProps {
  params: Promise<{ slug: string }>
}

export default async function DropBeatsPage({ params }: DropBeatsPageProps) {
  const { slug } = await params
  const supabase = await createAdminClient()

  // Fetch drop data
  const { data: drop } = await supabase.from("drops").select("*").eq("slug", slug).single()
  if (!drop) {
    // ... error handling
  }

  // Fetch beats for this drop with join to beats table
  const { data: dropsBeats } = await supabase
    .from("drop_beats")
    .select("*, beat:beats(*)")
    .eq("drop_id", drop.id)
    .order("order_index")

  // Flatten beats from join result
  const beats = (dropsBeats || []).map((item: any) => item.beat)


  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <section className="container mx-auto px-6 lg:px-12 pt-32 pb-24">
        <h1 className="font-serif text-5xl md:text-6xl text-primary mb-4 uppercase">{drop.title}</h1>
        {drop.description && (
          <p className="text-muted-foreground text-lg max-w-3xl mb-10 leading-relaxed">{drop.description}</p>
        )}
        <DropBeatsList beats={beats || []} />
      </section>
      <Footer />
    </main>
  )
}