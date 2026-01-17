"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CheckCircle2, Download, Music2, Mail, ArrowRight } from "lucide-react"
import Link from "next/link"

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const session_id = searchParams.get("session")
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [downloadUrl, setDownloadUrl] = useState<string>("")

  useEffect(() => {
    async function verifySession() {
      if (session_id) {
        try {
          const { getCheckoutStatus } = await import("@/app/actions/checkout")
          const { sendOrderEmail } = await import("@/app/actions/email")
          const result = await getCheckoutStatus(session_id)

          if ((result.status as string) === 'paid' || (result.status as string) === 'complete') {
            setStatus("success")
            if (result.beatSlug) {
              const type = result.licenseType?.toLowerCase() || "mp3"
              // Use the API route for all downloads to ensure correct handling/zipping
              if (type === "exclusive" || type === "unlimited" || type === "stems") {
                setDownloadUrl(`/api/download?slug=${result.beatSlug}&type=exclusive`)
              } else if (type === "wav") {
                setDownloadUrl(`/api/download?slug=${result.beatSlug}&type=wav`)
              } else {
                setDownloadUrl(`/api/download?slug=${result.beatSlug}&type=mp3`)
              }
            }

            localStorage.setItem("cart_count", "0")
            localStorage.removeItem("cart_session_id")
            window.dispatchEvent(new Event("storage"))

            // Nuclear Option: Trigger Email directly from client to ensure it sends even without webhook
            // We fire and forget this
            sendOrderEmail(session_id)
          } else {
            setStatus("error")
          }
        } catch (e) {
          console.error(e)
          setStatus("error")
        }
      } else {
        setStatus("error")
      }
    }
    verifySession()
  }, [session_id])

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground">Weryfikacja zamówienia...</p>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-12 h-12 text-destructive border-2 border-destructive rounded-full flex items-center justify-center">
          !
        </div>
        <h1 className="text-2xl font-serif text-white">Błąd zamówienia</h1>
        <p className="text-muted-foreground">Nie znaleziono sesji płatności lub płatność nieudana.</p>
        <Link href="/" className="text-primary hover:underline">Wróć na stronę główną</Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto text-center space-y-8 fade-in-up">
      <div className="bg-card/30 border border-border/50 rounded-sm p-12 space-y-8">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif text-white">Dziękujemy za zakup!</h1>
          <p className="text-gray-400 text-lg">
            Twoja transakcja została pomyślnie zrealizowana.
          </p>
        </div>

        <div className="grid gap-4 text-left">
          <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-sm border border-white/5">
            <Mail className="text-primary flex-shrink-0" size={24} />
            <div>
              <p className="font-medium text-white">Sprawdź email</p>
              <p className="text-sm text-muted-foreground">Wysłaliśmy potwierdzenie zakupu na Twój adres.</p>
            </div>
          </div>

          <div className="bg-secondary/30 border border-white/5 rounded-sm p-6">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <Music2 className="w-5 h-5 text-primary" />
              Twoje Pliki do pobrania
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-black/40 rounded border border-white/5 group hover:border-primary/30 transition-colors">
                <div className="text-left">
                  <p className="font-medium text-white">
                    {downloadUrl.includes("type=exclusive") ? "Paczka Beatów (ZIP)" : downloadUrl.includes("type=wav") ? "Plik Audio (WAV)" : "Plik Audio (MP3)"}
                  </p>
                  <p className="text-xs text-muted-foreground mr-2">
                    {downloadUrl.includes("type=exclusive") ? "Wszystkie ścieżki + Umowa" : downloadUrl.includes("type=wav") ? "Wysoka Jakość WAV + Umowa" : "Standardowa Jakość MP3 + Umowa"}
                  </p>
                </div>
                <a
                  href={downloadUrl || "#"}
                  download
                  className={`flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-sm text-sm font-medium hover:bg-primary/90 transition-colors ${!downloadUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Download className="w-4 h-4" />
                  Pobierz
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/">
            <button className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-[0.15em] text-xs px-8 py-4 rounded-sm transition-colors flex items-center gap-2 w-full sm:w-auto justify-center">
              Przeglądaj więcej beatów
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <section className="flex-1 flex items-center justify-center px-6 pt-32 pb-24">
        <Suspense fallback={<div>Loading...</div>}>
          <CheckoutSuccessContent />
        </Suspense>
      </section>
      <Footer />
    </main>
  )
}
