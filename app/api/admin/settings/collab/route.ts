import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    const supabase = await createClient()
    const { members } = await request.json()

    try {
        // Upsert the settings
        const { error } = await supabase
            .from("site_settings")
            .upsert(
                { key: "collab_page", value: { members } },
                { onConflict: "key" }
            )

        if (error) {
            console.error("Supabase error:", error)
            throw error
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Save error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
