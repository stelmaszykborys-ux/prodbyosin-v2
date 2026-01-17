import { Navigation } from "@/components/navigation"
import { BestsellerSection } from "@/components/bestseller-section"
import { VideoHero } from "@/components/video-hero"
import { Footer } from "@/components/footer"
import { createAdminClient } from "@/lib/supabase/admin"

export default async function Home() {
  // Use admin client to bypass RLS for public data fetching to ensure visibility
  const supabase = await createAdminClient()

  // Fetch featured beats to display as bestsellers on the landing page. Only published and featured beats are shown.
  const { data: beats } = await supabase
    .from("beats")
    .select("*")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(8)

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <VideoHero />

      <Footer />
    </main>
  )
}
