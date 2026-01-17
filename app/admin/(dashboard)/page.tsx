import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, ShoppingCart, Video, Users } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Dashboard | Admin Panel",
}

export default async function AdminDashboard() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-primary mb-2">Panel Sterowania</h1>
          <p className="text-muted-foreground text-lg">Witaj w centrum zarządzania ProdByOsin.</p>
        </div>
      </div>

      {/* Primary command center tiles */}
      <div className="grid gap-6 md:grid-cols-2">
        <Link href="/admin/beaty" className="group">
          <Card className="h-full bg-card/40 hover:bg-card/60 hover:border-primary/40 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl group-hover:text-primary">
                <Music size={20} /> 🎵 Zarządzaj Bitami
              </CardTitle>
              <CardDescription>Dodaj / edytuj beaty, pliki i status sprzedaży.</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/drops" className="group">
          <Card className="h-full bg-card/40 hover:bg-card/60 hover:border-primary/40 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl group-hover:text-primary">
                <ShoppingCart size={20} /> 📦 Zarządzaj Dropami
              </CardTitle>
              <CardDescription>Dodawaj produkty (zdjęcie, tytuł, link).</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/studio" className="group">
          <Card className="h-full bg-card/40 hover:bg-card/60 hover:border-primary/40 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl group-hover:text-primary">
                <Video size={20} /> 🎙️ Studio & Treści
              </CardTitle>
              <CardDescription>Galeria + edycja treści Studio / O Mnie.</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/collab" className="group">
          <Card className="h-full bg-card/40 hover:bg-card/60 hover:border-primary/40 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl group-hover:text-primary">
                <Users size={20} /> 🤝 Współprace / Collab
              </CardTitle>
              <CardDescription>Dodaj/usuń partnerów i wyczyść placeholdery.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  )
}
