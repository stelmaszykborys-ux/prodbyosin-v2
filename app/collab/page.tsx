import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { createAdminClient } from "@/lib/supabase/admin"

export default async function CollabPage() {
  const supabase = await createAdminClient()

  const { data: settings } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "collab_page")
    .single()

  const members = (settings?.value?.members || []) as any[]
  const producers = members.filter((m) => m.role === "producer")
  const artists = members.filter((m) => m.role === "artist")

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />
      <section className="pt-32 pb-24">
        <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary mb-16 uppercase text-center tracking-tight">
            Współprace
          </h1>

          {members.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <p>Lista współprac zostanie wkrótce zaktualizowana.</p>
            </div>
          ) : (
            <div>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {members.map((collab) => (
                  <li
                    key={collab.id || collab.name}
                    className="p-4 rounded-sm bg-card/20 border border-border/30 hover:bg-card/30 transition-all duration-300 hover:scale-[1.01]"
                  >
                    {collab.link ? (
                      <a href={collab.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-full overflow-hidden border border-border/50 shrink-0">
                          <img
                            src={collab.image_url || "/placeholder-user.jpg"}
                            alt={collab.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-medium text-lg text-foreground/90 hover:text-primary transition-colors">{collab.name}</span>
                      </a>
                    ) : (
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-full overflow-hidden border border-border/50 shrink-0">
                          <img
                            src={collab.image_url || "/placeholder-user.jpg"}
                            alt={collab.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-medium text-lg text-foreground/90">{collab.name}</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}