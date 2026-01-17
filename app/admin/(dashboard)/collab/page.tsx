import { Navigation } from "@/components/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { CollabManager } from "@/components/admin/collab-manager"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const metadata = {
    title: "Zarządzanie Collab | Admin",
}

export default async function CollabAdminPage() {
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

    // Ensure admin
    const { data: isAdmin } = await supabase.from("admins").select("id").eq("id", user.id).single()
    if (!isAdmin) redirect("/")

    // Fetch collab settings
    // We'll use a 'settings' table or similar. For now let's assume 'site_settings' with key 'collab_page'
    // If table doesn't exist, we might need to create it or handle error.
    // Assuming 'site_settings' structure: id, key (text unique), value (jsonb)

    const { data: settings } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "collab_page")
        .single()

    const initialData = settings?.value?.members || []

    return (
        <div className="flex min-h-screen bg-background">
            <AdminSidebar user={user} />
            <main className="flex-1 ml-64">
                <Navigation />
                <div className="pt-32 pb-12 px-6 lg:px-12">
                    <div className="container mx-auto max-w-4xl">
                        <h1 className="font-serif text-4xl font-light text-primary mb-8">Zarządzanie Współpracami (Collab)</h1>
                        <CollabManager initialData={initialData} />
                    </div>
                </div>
            </main>
        </div>
    )
}
