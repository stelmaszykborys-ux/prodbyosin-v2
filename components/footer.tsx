import Link from "next/link"
import { Instagram, Youtube, Facebook, Music2 } from "lucide-react"

/**
 * Footer component with a clear four‑column layout. It presents navigation,
 * license information, contact details and social media in a clean,
 * premium style. The brand name and tagline are displayed above the columns.
 */
export function Footer() {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-6 lg:px-12 py-20">
        {/* Brand & tagline */}
        <div className="mb-16">
          <Link href="/" className="font-serif text-3xl font-light tracking-wider text-primary">
            ProdByOsin
          </Link>
          <p className="mt-4 text-muted-foreground text-sm max-w-md leading-relaxed">
            Profesjonalna produkcja muzyczna. Tworzę unikalne beaty dla artystów, którzy chcą wyróżnić się na scenie.
          </p>
        </div>

        {/* Four columns */}
        <div className="grid md:grid-cols-4 gap-12">
          {/* Navigation */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-primary">Nawigacja</h3>
            <nav className="mt-4 flex flex-col gap-2">
              <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Strona główna
              </Link>
              <Link href="/studio" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Studio
              </Link>
              <Link href="/collab" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Collab
              </Link>
              <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                FAQ
              </Link>
              <Link href="/last-pack" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Last Pack
              </Link>
              <Link href="/custom-beats" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Custom Beats
              </Link>
              <Link href="/kontakt" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Kontakt
              </Link>
            </nav>
          </div>

          {/* Licenses */}
          <div>
            <Link href="/licencje" className="block hover:opacity-80 transition-opacity">
              <h3 className="text-xs uppercase tracking-[0.2em] text-primary">Licencje</h3>
            </Link>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-primary">Kontakt</h3>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <p>Warszawa, Polska</p>
              <a href="mailto:prodbyosin@gmail.com" className="hover:text-primary transition-colors">
                prodbyosin@gmail.com
              </a>
            </div>
          </div>

          {/* Social media */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-primary">Social&nbsp;Media</h3>
            <div className="mt-4 flex gap-4">
              <a
                href="https://www.instagram.com/prodbyosin/"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} ProdByOsin. Wszelkie prawa zastrzeżone.
          </p>
          <div className="flex gap-4 items-center">
            <p className="text-xs text-muted-foreground">Stworzono z pasją do muzyki</p>
            <a href="/admin/panel-edycji" className="text-[10px] text-muted-foreground/30 hover:text-primary transition-colors uppercase tracking-widest">
              Admin (Panel Edycji)
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}