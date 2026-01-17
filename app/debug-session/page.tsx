import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export default async function DebugSessionPage() {
    const cookieStore = await cookies()
    const supabase = await createClient()

    const { data: { user }, error } = await supabase.auth.getUser()

    return (
        <div className="p-8 font-mono text-sm">
            <h1 className="text-xl font-bold mb-4">Debug Sesji (Server Side)</h1>

            <div className="bg-gray-100 p-4 rounded mb-4">
                <h2 className="font-bold">Supabase Auth User:</h2>
                <pre>{JSON.stringify({ user: user?.email, id: user?.id, role: user?.role, error: error?.message }, null, 2)}</pre>
            </div>

            <div className="bg-gray-100 p-4 rounded">
                <h2 className="font-bold">Cookies Present:</h2>
                <ul>
                    {cookieStore.getAll().map(c => (
                        <li key={c.name}>{c.name} (Len: {c.value.length})</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
