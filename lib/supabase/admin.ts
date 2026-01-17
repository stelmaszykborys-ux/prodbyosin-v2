import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

/**
 * Creates a Supabase client with SERVICE_ROLE key to bypass RLS.
 * USE ONLY IN SERVER COMPONENTS for fetching public data that is blocked by RLS.
 */
export async function createAdminClient() {
    const cookieStore = await cookies()

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use Service Role Key
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    // Cookies are not needed for service role calls usually, but required by type signature
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
                    } catch {
                        // Server Component - ignore
                    }
                },
            },
        },
    )
}
