import { Navigation } from "@/components/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { ShopPageForm } from "@/components/admin/shop-page-form"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const metadata = {
    title: "Edycja Sklepu | Admin",
}

export default async function EditShopPage() {
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

    const { data: settings } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "shop_page")
        .single()

    return (
        <div className="flex min-h-screen bg-background">
            <AdminSidebar user={user} />
            <main className="flex-1 ml-64">
                <Navigation />
                <div className="pt-32 pb-12 px-6 lg:px-12">
                    <div className="container mx-auto max-w-4xl">
                        <h1 className="font-serif text-4xl font-light text-primary mb-8">Edycja Treści</h1>
                        <ShopPageForm initialData={settings?.value} />
                    </div>
                </div>
            </main>
        </div>
    )
}
