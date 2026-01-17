"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Music,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Plus,
  BarChart3,
  FileText,
  ImageIcon,
  Video,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface AdminSidebarProps {
  user: User
}

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/beaty", icon: Music, label: "Beaty (Beats)" },
  { href: "/admin/drops", icon: ShoppingCart, label: "Drops (Paczki)" },
  // Studio removed as per request
  { href: "/admin/collab", icon: Users, label: "Collab (Współprace)" },
  { href: "/admin/strony", icon: FileText, label: "Strony (Pages)" },
  { href: "/admin/o-mnie", icon: Info, label: "O mnie (Bio)" },
  { href: "/admin/zamowienia", icon: FileText, label: "Zamówienia" },
  { href: "/admin/uzytkownicy", icon: Users, label: "Użytkownicy" },
  { href: "/admin/ustawienia", icon: Settings, label: "Ustawienia" },
]

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/admin" className="font-serif text-xl text-primary">
          ProdByOsin
        </Link>
        <p className="text-xs text-muted-foreground mt-1">Panel Administracyjny</p>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-border space-y-2">
        <Link href="/admin/beaty/nowy">
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 justify-start">
            <Plus size={16} className="mr-2" />
            Dodaj Beat
          </Button>
        </Link>
        <Link href="/admin/drops/nowy">
          <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 justify-start">
            <ShoppingCart size={16} className="mr-2" />
            Dodaj Drop
          </Button>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-sm text-sm transition-colors ${isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-medium text-primary">{user.email?.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate">{user.email}</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full text-muted-foreground bg-transparent"
          onClick={handleLogout}
        >
          <LogOut size={14} className="mr-2" />
          Wyloguj się
        </Button>
      </div>

      {/* View Site */}
      <div className="p-4 border-t border-border">
        <Link href="/" target="_blank">
          <Button variant="ghost" size="sm" className="w-full text-muted-foreground">
            Zobacz stronę
          </Button>
        </Link>
      </div>
    </aside>
  )
}
