import { Suspense } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BeatsGrid } from "@/components/beats-grid"

export const metadata = {
  title: "Sklep | ProdByOsin",
  description: "Przeglądaj i kupuj profesjonalne beaty. Licencje MP3, WAV i Stems.",
}

import { createAdminClient } from "@/lib/supabase/admin"

export default async function ShopPage() {
  // Use Admin Client to bypass RLS for public beats
  const supabase = await createAdminClient()

  // Fetch settings
  const { data: settings } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "shop_page")
    .single()

  // Fetch beats
  const { data: beats } = await supabase
    .from("beats")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })

  const { title, description, header_label } = settings?.value || {
    title: "Sklep",
    description: "Wybierz beat idealny dla Twojego projektu. Każdy beat dostępny jest w trzech wariantach licencyjnych – od podstawowej MP3 po pełne stems.",
    header_label: "KATALOG BEATÓW"
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="pt-40 pb-32 px-6 lg:px-12">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-16 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">{header_label}</p>
            <h1 className="font-serif text-6xl md:text-7xl font-light text-primary">{title}</h1>
            <p className="text-muted-foreground mt-6 max-w-3xl mx-auto text-lg">
              {description}
            </p>
          </div>

          {/* Beats grid */}
          <div>
            <Suspense fallback={<BeatsGridSkeleton />}>
              <BeatsGrid initialBeats={beats || []} />
            </Suspense>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

function BeatsGridSkeleton() {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="aspect-square bg-card/50 animate-pulse rounded" />
      ))}
    </div>
  )
}
