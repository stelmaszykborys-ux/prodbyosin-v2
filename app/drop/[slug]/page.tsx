import { createAdminClient } from "@/lib/supabase/admin"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

interface DropPageProps {
  params: Promise<{ slug: string }>
}

export default async function DropPage({ params }: DropPageProps) {
  const { slug } = await params
  const supabase = await createAdminClient()

  const { data: drop } = await supabase.from("drops").select("*").eq("slug", slug).single()

  if (!drop) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-light text-primary">Drop nie znaleziony</h1>
            <p className="text-muted-foreground">Wróć na stronę główną i spróbuj ponownie</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <section className="flex-1 flex items-center justify-center px-6 lg:px-12 pt-28 pb-24">
        <div className="text-center space-y-8">
          {/* Large glitch heading for the drop title */}
          <h1 className="relative font-serif text-6xl md:text-7xl lg:text-8xl uppercase text-primary select-none">
            {drop.title}
          </h1>
          {drop.description && (
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              {drop.description}
            </p>
          )}
          <div className="pt-8">
            <a
              href={`/drop/${slug}/beats`}
              className="inline-block bg-primary text-primary-foreground px-10 py-4 uppercase font-semibold tracking-wider hover:bg-primary/80 transition-colors"
            >
              Enter pack
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
