import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, DollarSign, ShoppingCart, Music } from "lucide-react"

export default async function AdminStatsPage() {
  const supabase = await createClient()

  // Fetch all orders
  const { data: orders } = await supabase.from("orders").select("*").eq("status", "completed")

  // Fetch all beats
  const { data: beats } = await supabase.from("beats").select("*")

  // Calculate stats
  const totalRevenue = orders?.reduce((sum, o) => sum + o.price_paid, 0) || 0
  const totalOrders = orders?.length || 0
  const totalBeats = (beats as any[])?.length || 0
  const publishedBeats = (beats as any[])?.filter((b) => b.is_published).length || 0

  // License breakdown
  const licenseBreakdown = {
    mp3: orders?.filter((o) => o.license_type === "mp3").length || 0,
    wav: orders?.filter((o) => o.license_type === "wav").length || 0,
    stems: orders?.filter((o) => o.license_type === "stems").length || 0,
  }

  // Genre breakdown
  const genreStats = (beats as any[])?.reduce(
    (acc, beat) => {
      if (beat.genre) {
        acc[beat.genre] = (acc[beat.genre] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>,
  )

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(priceInCents / 100)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-primary">Statystyki</h1>
        <p className="text-muted-foreground">Analiza sprzedaży i wydajności</p>
      </div>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Całkowity przychód</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-light text-primary">{formatPrice(totalRevenue)}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp size={14} className="text-green-500" />
              <span className="text-xs text-green-500">+12% od poprzedniego miesiąca</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Zamówienia</CardTitle>
            <ShoppingCart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-light text-primary">{totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">zrealizowanych</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Beaty w katalogu</CardTitle>
            <Music className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-light text-primary">{totalBeats}</div>
            <p className="text-xs text-muted-foreground mt-1">{publishedBeats} opublikowanych</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Średnia wartość</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-light text-primary">
              {totalOrders > 0 ? formatPrice(totalRevenue / totalOrders) : formatPrice(0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">na zamówienie</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* License Breakdown */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle>Sprzedaż wg licencji</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">MP3</span>
                <span className="text-sm text-muted-foreground">{licenseBreakdown.mp3} sprzedanych</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${totalOrders > 0 ? (licenseBreakdown.mp3 / totalOrders) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">WAV</span>
                <span className="text-sm text-muted-foreground">{licenseBreakdown.wav} sprzedanych</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full"
                  style={{ width: `${totalOrders > 0 ? (licenseBreakdown.wav / totalOrders) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Stems</span>
                <span className="text-sm text-muted-foreground">{licenseBreakdown.stems} sprzedanych</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-chart-3 rounded-full"
                  style={{ width: `${totalOrders > 0 ? (licenseBreakdown.stems / totalOrders) * 100 : 0}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Genre Breakdown */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle>Beaty wg gatunku</CardTitle>
          </CardHeader>
          <CardContent>
            {genreStats && Object.keys(genreStats).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(genreStats as Record<string, number>)
                  .sort((a, b) => b[1] - a[1])
                  .map(([genre, count]) => (
                    <div key={genre} className="flex items-center justify-between">
                      <span className="text-sm">{genre}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${(count / totalBeats) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-8">{count}</span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-8">Brak danych</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
