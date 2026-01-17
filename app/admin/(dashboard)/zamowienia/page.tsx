import { createClient } from "@/lib/supabase/server"
import { Card } from "@/components/ui/card"
import { OrdersTable } from "@/components/admin/orders-table"

export default async function AdminOrdersPage() {
  const supabase = await createClient()

  const { data: orders } = await supabase
    .from("orders")
    .select("*, beat:beats(title, slug)")
    .order("created_at", { ascending: false })

  // Stats
  const completedOrders = orders?.filter((o) => o.status === "completed") || []
  const pendingOrders = orders?.filter((o) => o.status === "pending") || []
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.price_paid, 0)

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(priceInCents / 100)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-primary">Zamówienia</h1>
        <p className="text-muted-foreground">Zarządzaj zamówieniami i płatnościami</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50 p-4">
          <p className="text-2xl font-light text-primary">{orders?.length || 0}</p>
          <p className="text-xs text-muted-foreground">Wszystkie</p>
        </Card>
        <Card className="bg-card/50 border-border/50 p-4">
          <p className="text-2xl font-light text-green-500">{completedOrders.length}</p>
          <p className="text-xs text-muted-foreground">Zrealizowane</p>
        </Card>
        <Card className="bg-card/50 border-border/50 p-4">
          <p className="text-2xl font-light text-yellow-500">{pendingOrders.length}</p>
          <p className="text-xs text-muted-foreground">Oczekujące</p>
        </Card>
        <Card className="bg-card/50 border-border/50 p-4">
          <p className="text-2xl font-light text-primary">{formatPrice(totalRevenue)}</p>
          <p className="text-xs text-muted-foreground">Przychód</p>
        </Card>
      </div>

      <OrdersTable orders={orders || []} />
    </div>
  )
}
