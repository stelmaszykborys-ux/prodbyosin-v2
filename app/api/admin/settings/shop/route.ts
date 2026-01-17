import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    const supabase = await createClient()
    const { title, description, header_label } = await request.json()

    try {
        const { error } = await supabase
            .from("site_settings")
            .upsert(
                { key: "shop_page", value: { title, description, header_label } },
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
