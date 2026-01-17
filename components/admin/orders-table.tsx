"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MoreHorizontal, Check, X, RefreshCw } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Order } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { LICENSE_NAMES } from "@/lib/types"

interface OrdersTableProps {
  orders: (Order & { beat?: { title: string; slug: string } | null })[]
}

export function OrdersTable({ orders: initialOrders }: OrdersTableProps) {
  const [orders, setOrders] = useState(initialOrders)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer_email.toLowerCase().includes(search.toLowerCase()) ||
      order.beat?.title?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(priceInCents / 100)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pl-PL", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId)

    if (!error) {
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: status as Order["status"] } : o)))
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded">Zrealizowane</span>
      case "pending":
        return <span className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded">Oczekujące</span>
      case "failed":
        return <span className="text-xs bg-red-500/10 text-red-500 px-2 py-1 rounded">Nieudane</span>
      case "refunded":
        return <span className="text-xs bg-blue-500/10 text-blue-500 px-2 py-1 rounded">Zwrócone</span>
      default:
        return <span className="text-xs bg-muted px-2 py-1 rounded">{status}</span>
    }
  }

  return (
    <>
      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Szukaj zamówień..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card/50 border-border/50"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 bg-card/50 border-border/50">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Wszystkie statusy</SelectItem>
            <SelectItem value="completed">Zrealizowane</SelectItem>
            <SelectItem value="pending">Oczekujące</SelectItem>
            <SelectItem value="failed">Nieudane</SelectItem>
            <SelectItem value="refunded">Zwrócone</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="bg-card/50 border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  Zamówienie
                </th>
                <th className="text-left p-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  Klient
                </th>
                <th className="text-left p-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  Beat
                </th>
                <th className="text-left p-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  Licencja
                </th>
                <th className="text-left p-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  Kwota
                </th>
                <th className="text-left p-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  Status
                </th>
                <th className="text-left p-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  Data
                </th>
                <th className="text-right p-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  Akcje
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20">
                  <td className="p-4 text-sm font-mono text-muted-foreground">{order.id.slice(0, 8)}...</td>
                  <td className="p-4">
                    <p className="text-sm">{order.customer_email}</p>
                    {order.customer_name && <p className="text-xs text-muted-foreground">{order.customer_name}</p>}
                  </td>
                  <td className="p-4 text-sm">{order.beat?.title || "Beat usunięty"}</td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {LICENSE_NAMES[order.license_type as keyof typeof LICENSE_NAMES]}
                  </td>
                  <td className="p-4 text-sm font-medium">{formatPrice(order.price_paid)}</td>
                  <td className="p-4">{getStatusBadge(order.status)}</td>
                  <td className="p-4 text-sm text-muted-foreground">{formatDate(order.created_at)}</td>
                  <td className="p-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "completed")}>
                          <Check size={14} className="mr-2" />
                          Oznacz jako zrealizowane
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "refunded")}>
                          <RefreshCw size={14} className="mr-2" />
                          Oznacz jako zwrócone
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "failed")}>
                          <X size={14} className="mr-2" />
                          Oznacz jako nieudane
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {search || statusFilter !== "all" ? "Nie znaleziono zamówień" : "Brak zamówień"}
          </div>
        )}
      </Card>
    </>
  )
}
