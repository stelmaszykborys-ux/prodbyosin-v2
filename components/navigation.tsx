"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/input/cart-provider"

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  // Track the logged in user and whether they are an admin
  const [user, setUser] = useState<any | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { cartCount } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // On mount, fetch the current user and check if they are an admin. This keeps
  // navigation links in sync with authentication state. We wrap the async
  // operations inside an effect since createClient is only available client‑side.
  useEffect(() => {
    const supabase = createClient()
    const fetchUser = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()
      setUser(currentUser)
      if (currentUser) {
        const { data: adminData } = await supabase
          .from("admins")
          .select("id")
          .eq("id", currentUser.id)
          .single()
        setIsAdmin(!!adminData)
      } else {
        setIsAdmin(false)
      }
    }
    fetchUser()
  }, [])

  const isHome = pathname === "/"

  const navLinks = [
    { href: "/", label: "Strona główna" },
    // Link to the Studio page where behind‑the‑scenes videos and photos are displayed
    { href: "/studio", label: "Studio" },
    // New page for collaboration opportunities (producers and artists)
    { href: "/collab", label: "Collab" },
    // Frequently asked questions about beats, licensing and orders
    { href: "/faq", label: "FAQ" },
    // Detailed license information
    { href: "/licencje", label: "Licencje" },
    // A dedicated page showcasing collections
    { href: "/drops", label: "Drops" },
    // A form for ordering custom beats
    { href: "/custom-beats", label: "Custom Beats" },
    // Contact page with email and social links
    { href: "/kontakt", label: "Kontakt" },
  ]

  // Logout handler used when a logged‑in user selects "Wyloguj" from the navigation.
  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    // Refresh user state
    setUser(null)
    setIsAdmin(false)
    router.push("/")
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 will-change-transform ${isScrolled || !isHome
        ? "bg-black/40 backdrop-blur-xl border-b border-white/5 py-4"
        : "bg-transparent py-6"
        }`}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-2xl font-bold tracking-wider text-primary hover:opacity-80 transition-opacity z-50 relative"
          >
            ProdByOsin
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative text-[10px] uppercase tracking-[0.2em] font-medium transition-colors ${pathname === link.href ? "text-primary" : "text-muted-foreground hover:text-white"
                  }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full ${pathname === link.href ? "w-full" : ""}`} />
              </Link>
            ))}
            {/* Always show a cart button */}
            <Link href="/koszyk">
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-[0.15em] text-[10px] px-6 h-9 rounded-sm font-semibold flex items-center gap-2"
              >
                <span>Koszyk</span>
                {cartCount > 0 && (
                  <span className="bg-white text-black rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
            {/* Admin-only controls */}
            {user && (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-[10px] uppercase tracking-[0.2em] transition-colors text-muted-foreground hover:text-primary"
                  >
                    Panel Admina
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-[10px] uppercase tracking-[0.2em] transition-colors text-muted-foreground hover:text-primary"
                >
                  Wyloguj
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-primary p-2 z-50 relative"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-black/95 backdrop-blur-xl border-b border-white/5 absolute top-full left-0 right-0 shadow-2xl"
          >
            <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className={`text-lg uppercase tracking-[0.1em] transition-colors py-2 block font-light ${pathname === link.href ? "text-primary" : "text-muted-foreground hover:text-white"
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Link href="/koszyk" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-[0.15em] w-full text-xs font-semibold"
                  >
                    Koszyk
                  </Button>
                </Link>
              </motion.div>

              {/* Admin-only controls (mobile) */}
              {user && (
                <div className="pt-4 border-t border-white/10 flex flex-col gap-4">
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-xs uppercase tracking-[0.2em] transition-colors text-muted-foreground hover:text-primary"
                    >
                      Panel Admina
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMobileMenuOpen(false)
                    }}
                    className="text-xs uppercase tracking-[0.2em] transition-colors text-muted-foreground hover:text-primary text-left"
                  >
                    Wyloguj
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
