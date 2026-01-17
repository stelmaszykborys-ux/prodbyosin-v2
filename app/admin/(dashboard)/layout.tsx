import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminOnboarding } from "@/components/admin/admin-onboarding"

export const metadata = {
  title: "Panel Admina | prodbyosin",
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/admin/login?redirect=/admin")
  }

  // Check if user is admin
  const { data: adminData } = await supabase.from("admins").select("id").eq("id", user.id).single()

  if (!adminData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full bg-card border border-destructive/50 p-6 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Brak Uprawnień</h1>
          <p className="text-muted-foreground mb-6">
            Jesteś zalogowany, ale Twoje konto nie ma uprawnień administratora.
          </p>
          <p className="text-muted-foreground mb-6">
            Jesteś zalogowany, ale Twoje konto nie ma uprawnień administratora.
          </p>
          <AdminOnboarding userId={user.id} />
          <a href="/" className="text-sm underline hover:text-primary">Wróć na stronę główną</a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar user={user} />
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  )
}
