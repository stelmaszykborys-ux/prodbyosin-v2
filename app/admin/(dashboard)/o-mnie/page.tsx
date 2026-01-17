import { Navigation } from "@/components/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AboutEditForm } from "@/components/admin/about-edit-form"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Edytuj O mnie | Admin",
}

export default async function EditAboutPage() {
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
    redirect("/admin/login?redirect=/admin/o-mnie")
  }

  const { data: isAdmin } = await supabase.from("admins").select("id").eq("id", user.id).single()

  if (!isAdmin) {
    redirect("/")
  }

  const { data: aboutSettings } = await supabase.from("site_settings").select("value").eq("key", "about_page").single()

  return (
    <>
      <Navigation />
      <div className="pt-32 pb-12 px-6 lg:px-12">
        <div className="container mx-auto max-w-2xl">
          <h1 className="font-serif text-4xl font-light text-primary mb-8">Edytuj stronę "O mnie"</h1>
          <AboutEditForm initialData={aboutSettings?.value} />
        </div>
      </div>
    </>
  )
}
