import { Navigation } from "@/components/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ShoppingBag, ArrowRight } from "lucide-react"

export const metadata = {
  title: "Zarządzanie Stronami | Admin",
}

export default async function PagesAdminPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    },
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/admin/login")

  const { data: isAdmin } = await supabase.from("admins").select("id").eq("id", user.id).single()
  if (!isAdmin) redirect("/")

  const pages = [
    {
      id: "sklep",
      name: "Sklep (Katalog)",
      description: "Edytuj nagłówek, opis i teksty na stronie sklepu.",
      path: "/admin/strony/sklep",
      icon: ShoppingBag
    }
    // Future pages can be added here
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar user={user} />
      <main className="flex-1 ml-64">
        <Navigation />
        <div className="pt-32 pb-12 px-6 lg:px-12">
          <div className="container mx-auto">
            <h1 className="font-serif text-4xl font-light text-primary mb-8">Zarządzanie Stronami</h1>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pages.map((page) => (
                <Link key={page.id} href={page.path}>
                  <Card className="bg-card/50 border-border/50 hover:border-primary/50 transition-colors group cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="p-2 bg-primary/10 rounded-sm text-primary mb-4">
                          <page.icon size={24} />
                        </div>
                        <ArrowRight className="text-muted-foreground group-hover:text-primary transition-colors transform group-hover:translate-x-1" />
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">{page.name}</CardTitle>
                      <CardDescription className="pt-2">{page.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
