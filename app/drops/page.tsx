import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { DropsSection } from "@/components/drops-section"
import { createAdminClient } from "@/lib/supabase/admin"

export const metadata = {
    title: "Drops | ProdByOsin",
    description: "Przeglądaj wszystkie kolekcje beatów.",
}

export default async function DropsPage() {
    // Use Admin Client to ensure drops are visible regardless of RLS
    const supabase = await createAdminClient()

    const { data: drops } = await supabase
        .from("drops")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })

    return (
        <main className="min-h-screen bg-background">
            <Navigation />
            <div className="pt-20">
                <DropsSection drops={drops || []} />
            </div>
            <Footer />
        </main>
    )
}
