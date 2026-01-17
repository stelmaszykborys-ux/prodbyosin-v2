import { Navigation } from "@/components/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { FAQForm } from "@/components/admin/faq-form"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { AdminFAQItem } from "@/components/admin/faq-management"

export const metadata = {
  title: "Edytuj FAQ | Admin",
}

/**
 * Page for editing an existing FAQ item.
 */
export default async function EditFAQPage({ params }: { params: Promise<{ id: string }> }) {
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
  const { data: isAdmin } = await supabase.from("admins").select("id").eq("id", user.id).single()
  if (!isAdmin) {
    redirect("/")
  }
  const { id } = await params
  const { data: item } = await supabase
    .from("faq_items")
    .select("id, question, answer, category, is_published, order_index")
    .eq("id", id)
    .single()
  if (!item) {
    redirect("/admin/faq")
  }
  return (
    <>
      <Navigation />
      <div className="pt-32 pb-12 px-6 lg:px-12">
        <div className="container mx-auto max-w-2xl">
          <h1 className="font-serif text-4xl font-light text-primary mb-8">Edytuj pytanie FAQ</h1>
          <FAQForm item={item as AdminFAQItem} />
        </div>
      </div>
    </>
  )
}