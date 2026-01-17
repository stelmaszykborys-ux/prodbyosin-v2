import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { StudioGrid, type StudioItem } from "@/components/studio-grid"

const STATIC_ITEMS: StudioItem[] = [
  {
    id: "1",
    title: "",
    image_url: "/images/studio/1.png",
    is_active: true,
  },
  {
    id: "2",
    title: "",
    image_url: "/images/studio/2.png",
    is_active: true,
  },
  {
    id: "3",
    title: "",
    image_url: "/images/studio/3.png",
    is_active: true,
  },
  {
    id: "4",
    title: "",
    image_url: "/images/studio/4.png",
    is_active: true,
  },
  {
    id: "5",
    title: "",
    image_url: "/images/studio/5.png",
    is_active: true,
  },
  {
    id: "6",
    title: "Aktualny Setup 2026",
    image_url: "/images/studio/studio_setup_2026.png",
    is_active: true,
  },
]

export default function StudioPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <section className="pt-32 pb-16 px-6 lg:px-12">
        <div className="container mx-auto">
          <h1 className="text-5xl md:text-6xl font-light text-primary mb-8">Studio</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-12 whitespace-pre-line">
            To miejsce, w którym powstaje cały mój sound. Pracuję na połączeniu cyfry i analogu, skupiając się na klimacie, selekcji dźwięków i detalach, które robią różnicę.
            {"\n\n"}
            Każdy beat jest tworzony od zera, bez gotowych schematów. Liczy się vibe, przestrzeń i emocja, a nie ilość dźwięków. Poniżej możesz zobaczyć sprzęt, na którym pracuję, oraz fragmenty mojej codziennej pracy w studio.
          </p>
          <StudioGrid items={STATIC_ITEMS} />
        </div>
      </section>
      <Footer />
    </main>
  )
}