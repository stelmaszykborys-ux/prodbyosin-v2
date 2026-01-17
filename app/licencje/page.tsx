import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Check, X, AlertCircle } from "lucide-react"

export const metadata = {
    title: "Licencje | ProdByOsin",
    description: "Wybierz licencję dla siebie: Basic Free, Premium Lease lub Exclusive.",
}

export default function LicensesPage() {
    const licenses = [
        {
            name: "BASIC LEASE",
            price: "150 zł",
            description: "Dla ludzi, którzy robią muzykę niezależnie, social, demo, YouTube, Spotify.",
            features: [
                "Plik MP3",
                "Licencja do użytku komercyjnego",
                "Publikacja utworu",
                "Sprzedaż na streamingach",
                "Brak wyłączności (beat może kupić ktoś inny)",
            ],
            limitations: [
                "Brak stemów",
                "Nie można udostępniać ani sprzedawać samego beatu jako pliku",
            ],
            highlight: false,
        },
        {
            name: "PREMIUM LEASE",
            price: "300 zł",
            description: "Dla artystów, którzy chcą pracować poważniej nad mixem i masterem.",
            features: [
                "WAV (pełna jakość)",
                "STEMS (do miksowania)",
                "Licencja komercyjna",
                "Publikacja na streamingach",
                "Beat może być sprzedany innym",
            ],
            pros: ["Lepsza jakość", "Więcej kontroli nad mixem", "Dobry balans ceny i możliwości"],
            highlight: true,
        },
        {
            name: "EXCLUSIVE BEAT",
            price: "500 zł",
            description: "Dla tych, którzy chcą mieć beat tylko dla siebie i budować własny wizerunek.",
            features: [
                "WAV + STEMS",
                "Pełna wyłączność (beat znika z oferty)",
                "Poprawki pod artystę",
                "Prawa do wykorzystania bez ryzyka",
                "Publikacja na streamingach",
            ],
            notes: [
                "Cena za exclusiv może rosnąć w przyszłości",
                "Tylko jedna osoba ma prawo używać tego beatu",
            ],
            highlight: false,
        },
    ]

    return (
        <main className="min-h-screen bg-background">
            <Navigation />

            <section className="pt-32 pb-24 px-6 lg:px-12">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="font-serif text-5xl md:text-6xl text-primary mb-6">Licencje</h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Wybierz opcję dopasowaną do Twoich potrzeb.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {licenses.map((license, index) => (
                            <div
                                key={license.name}
                                className={`relative p-8 rounded-sm border transition-all duration-300 flex flex-col ${license.highlight
                                        ? "bg-card/60 border-primary/50 shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)] scale-105 z-10"
                                        : "bg-card/30 border-border/50 hover:border-border"
                                    }`}
                            >
                                {license.highlight && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 text-xs uppercase tracking-widest font-bold rounded-full">
                                        Polecane
                                    </div>
                                )}

                                <div className="mb-8 text-center">
                                    <h3 className="text-xl uppercase tracking-[0.2em] font-light mb-2">{license.name}</h3>
                                    <div className="text-4xl font-serif text-primary mb-4">{license.price}</div>
                                    <p className="text-sm text-muted-foreground min-h-[40px]">{license.description}</p>
                                </div>

                                <div className="space-y-6 flex-grow">
                                    <div>
                                        <span className="text-xs uppercase tracking-wider text-primary opacity-70 mb-2 block">Co dostajesz:</span>
                                        <ul className="space-y-3">
                                            {license.features.map((feature, i) => (
                                                <li key={i} className="flex items-start gap-3 text-sm text-card-foreground/90">
                                                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {license.limitations && (
                                        <div>
                                            <span className="text-xs uppercase tracking-wider text-red-400 opacity-70 mb-2 block">Ograniczenia:</span>
                                            <ul className="space-y-3">
                                                {license.limitations.map((limitation, i) => (
                                                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                                                        <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                                        <span>{limitation}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {license.pros && (
                                        <div>
                                            <span className="text-xs uppercase tracking-wider text-primary opacity-70 mb-2 block">Plusy:</span>
                                            <ul className="space-y-3">
                                                {license.pros.map((pro, i) => (
                                                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                                                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                                        <span>{pro}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {license.notes && (
                                        <div>
                                            <span className="text-xs uppercase tracking-wider text-primary opacity-70 mb-2 block">Uwagi:</span>
                                            <ul className="space-y-3">
                                                {license.notes.map((note, i) => (
                                                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                                                        <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                                        <span>{note}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 pt-8 border-t border-border/50">
                                    <a href="/sklep" className={`block w-full text-center py-3 rounded-sm uppercase tracking-widest text-xs font-bold transition-colors ${license.highlight
                                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                            : "bg-secondary/50 text-secondary-foreground hover:bg-secondary/70"
                                        }`}>
                                        Wybierz
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 max-w-4xl mx-auto bg-primary/5 border border-primary/20 p-8 rounded-sm text-center">
                        <h3 className="text-lg font-bold text-primary mb-4 uppercase tracking-widest flex items-center justify-center gap-2">
                            <AlertCircle size={20} />
                            Ważne Informacje
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Kupując beat, nabywasz <strong className="text-primary">licencję</strong> do jego wykorzystania, nie prawa autorskie.
                            Autorstwo beatu pozostaje po stronie <strong className="text-primary">PRODBYOSIN</strong>.
                            Zabroniona jest dalsza odsprzedaż, udostępnianie lub dystrybucja samego beatu w jakiejkolwiek formie.
                            Licencja obowiązuje od momentu zakupu.
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
