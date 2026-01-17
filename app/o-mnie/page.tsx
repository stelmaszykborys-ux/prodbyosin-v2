import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { createAdminClient } from "@/lib/supabase/admin"

export default async function AboutPage() {
  const supabase = await createAdminClient()

  const { data: aboutSettings } = await supabase.from("site_settings").select("value").eq("key", "about_page").single()

  const about = aboutSettings?.value || {
    title: "O mnie",
    subtitle: "Producent Muzyczny",
    image_url: null,
    description: "Zawartość do uzupełnienia przez admin w panelu zarządzania",
    stats: [],
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-32 pb-24 px-6 lg:px-12">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            {about.image_url && (
              <div className="relative">
                <div className="aspect-[4/5] bg-gradient-to-br from-secondary to-muted rounded-sm overflow-hidden">
                  <img
                    src={about.image_url || "/placeholder.svg"}
                    alt={about.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-primary/30 rounded-sm" />
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-sm" />
              </div>
            )}

            {/* Content */}
            <div className="space-y-8">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">{about.subtitle}</p>
                <h1 className="font-serif text-5xl md:text-6xl font-light text-primary">{about.title}</h1>
              </div>

              {about.description && (
                <div className="space-y-4 text-muted-foreground leading-relaxed prose prose-invert max-w-none">
                  {about.description.split("\n\n").map((paragraph: string, i: number) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              )}

              {/* Stats */}
              {about.stats && about.stats.length > 0 && (
                <div className="grid grid-cols-3 gap-8 py-8 border-y border-border/50">
                  {about.stats.map((stat: any, i: number) => (
                    <div key={i}>
                      <p className="text-3xl font-light text-primary">{stat.value}</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
