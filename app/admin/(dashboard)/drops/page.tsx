import { Navigation } from "@/components/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { DropsManagement } from "@/components/admin/drops-management"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Zarządzanie Drop'ami | Admin",
}

export default async function DropsPage() {
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
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch { }
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login?redirect=/admin/drops")
  }

  const { data: isAdmin } = await supabase.from("admins").select("id").eq("id", user.id).single()

  if (!isAdmin) {
    redirect("/")
  }

  const { data: drops } = await supabase.from("drops").select("*").order("order_index")

  return (
    <>
      <Navigation />
      <div className="pt-32 pb-12 px-6 lg:px-12">
        <div className="container mx-auto">
          <h1 className="font-serif text-4xl font-light text-primary mb-8">Zarządzanie Drop'ami</h1>
          <DropsManagement drops={drops || []} />
        </div>
      </div>
    </>
  )
}
