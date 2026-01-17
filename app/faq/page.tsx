import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { FAQSection } from "@/components/faq-section"

export const metadata = {
  title: "FAQ | ProdByOsin",
  description: "Najczęściej zadawane pytania dotyczące beatów, licencji i zakupów.",
}

/**
 * Dedicated FAQ page. Extracted from the home page to give
 * visitors a clear place to find answers without scrolling through other content.
 */
export default function FAQPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <FAQSection />
      {/* Call to action below FAQ */}
      <section className="py-24 text-center bg-background">
        <div className="container mx-auto px-6 lg:px-12 fade-in-up">
          <h3 className="font-serif text-4xl md:text-5xl font-light text-primary mb-6">
            Gotowy na nowy beat?
          </h3>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Przejdź do sklepu i odkryj naszą kolekcję bestsellerów albo wróć na stronę główną, aby posłuchać
            najpopularniejszych beatów.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/sklep"
              className="inline-block bg-primary text-primary-foreground px-8 py-4 font-semibold uppercase tracking-wider text-sm hover:bg-primary/85 transition-all duration-300"
            >
              Kup beat
            </a>
            <a
              href="/#bestsellery"
              className="inline-block bg-transparent border border-primary/40 text-primary px-8 py-4 font-semibold uppercase tracking-wider text-sm hover:bg-primary/10 hover:border-primary transition-all duration-300"
            >
              Bestsellery
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}