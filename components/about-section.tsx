import { Instagram, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AboutSection() {
  return (
    <section id="o-mnie" className="py-24 px-4 bg-gradient-to-b from-secondary/20 to-background">
      <div className="container mx-auto max-w-4xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative aspect-square rounded overflow-hidden">
            <img src="/music-producer-studio-portrait-dark.jpg" alt="prodbyosin" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>

          {/* Content */}
          <div className="space-y-6">
            <h2 className="font-serif text-5xl md:text-6xl font-light text-primary">O mnie</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Witaj w moim świecie. prodbyosin to nie tylko nazwa - to styl życia, pasja i oddanie dla muzyki, która
                łączy klimat z najwyższą jakością.
              </p>
              <p>
                Każdy beat, który tworzę, to efekt godzin pracy w studiu, eksperymentowania z dźwiękiem i poszukiwania
                perfekcji. Nie interesuje mnie masowa produkcja - interesuje mnie tworzenie czegoś wyjątkowego.
              </p>
              <p>
                Jeśli szukasz muzyki, która wyróżni Twój projekt i podniesie go na wyższy poziom, jesteś we właściwym
                miejscu.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-wider"
                size="lg"
              >
                <Mail className="mr-2" size={18} />
                Kontakt
              </Button>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10 uppercase tracking-wider bg-transparent"
                size="lg"
              >
                <Instagram className="mr-2" size={18} />
                Instagram
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-24 pt-12 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">© 2025 prodbyosin. Wszelkie prawa zastrzeżone.</p>
        </div>
      </div>
    </section>
  )
}
