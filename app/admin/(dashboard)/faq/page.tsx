import { Navigation } from "@/components/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { FAQManagement } from "@/components/admin/faq-management"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Zarządzanie FAQ | Admin",
}

/**
 * Admin page for managing FAQ items. Requires the user to be authenticated and an admin.
 */
export default async function FAQAdminPage() {
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

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login?redirect=/admin/faq")
  }

  // Ensure the user is an admin
  const { data: isAdmin } = await supabase.from("admins").select("id").eq("id", user.id).single()
  if (!isAdmin) {
    redirect("/")
  }

  // Fetch all FAQ items for management (including unpublished)
  const { data: items } = await supabase
    .from("faq_items")
    .select("id, question, answer, category, is_published, order_index")
    .order("order_index", { ascending: true })

  return (
    <>
      <Navigation />
      <div className="pt-32 pb-12 px-6 lg:px-12">
        <div className="container mx-auto">
          <h1 className="font-serif text-4xl font-light text-primary mb-8">Zarządzanie FAQ</h1>
          <FAQManagement items={items || []} />
        </div>
      </div>
    </>
  )
}