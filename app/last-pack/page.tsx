import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export const metadata = {
  title: "Last Pack | ProdByOsin",
  description: "Odkryj poprzednią paczkę beatów od ProdByOsin i kup dostęp do wszystkich utworów.",
}

/**
 * Last Pack page fetches the most recent drop other than the currently featured one.
 * It displays the title, description and a CTA leading to the beats listing.
 */
export default async function LastPackPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    },
  )

  // Fetch all drops ordered by creation date descending
  const { data: allDrops } = await supabase.from("drops").select("*").order("created_at", { ascending: false })
  if (!allDrops || allDrops.length < 2) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <section className="container mx-auto px-6 lg:px-12 pt-32 pb-24 text-center">
          <h1 className="font-serif text-5xl md:text-6xl text-primary mb-6 uppercase">Last Pack</h1>
          <p className="text-muted-foreground text-lg mb-10">
            Nie znaleziono wcześniejszej paczki. Wróć później, aby odkryć więcej.
          </p>
        </section>
        <Footer />
      </main>
    )
  }

  // Assume the first drop is current; select the next one as last pack
  const lastPack = allDrops[1]

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <section className="flex flex-col items-center justify-center pt-32 pb-24 px-6 lg:px-12">
        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl uppercase text-primary mb-6 text-center">
          {lastPack.title}
        </h1>
        {lastPack.description && (
          <p className="text-muted-foreground text-lg max-w-2xl mb-8 text-center leading-relaxed">
            {lastPack.description}
          </p>
        )}
        <a
          href={`/drop/${lastPack.slug}/beats`}
          className="inline-block bg-primary text-primary-foreground px-12 py-4 uppercase font-semibold tracking-wider hover:bg-primary/80 transition-colors"
        >
          Zobacz pakiet
        </a>
      </section>
      <Footer />
    </main>
  )
}