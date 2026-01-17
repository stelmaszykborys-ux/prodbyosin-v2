import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { beat_id, license_type, price, session_id } = body

    const supabase = await createAdminClient()

    const { error } = await supabase.from("cart_items").insert({
      session_id,
      beat_id,
      license_type,
      price,
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Cart error:", error)
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
  }
}
