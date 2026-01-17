import { notFound } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BeatDetails } from "@/components/beat-details"
import { createClient } from "@/lib/supabase/server"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: beat } = await supabase.from("beats").select("title, description").eq("slug", slug).single()

  if (!beat) {
    return { title: "Beat nie znaleziony | prodbyosin" }
  }

  return {
    title: `${beat.title} | prodbyosin`,
    description: beat.description || `Kup beat ${beat.title} - profesjonalna produkcja muzyczna.`,
  }
}

export default async function BeatPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: beat, error } = await supabase
    .from("beats")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  if (error || !beat) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <BeatDetails beat={beat} />
      <Footer />
    </main>
  )
}
