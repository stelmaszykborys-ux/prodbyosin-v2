import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    const supabase = await createClient()
    const { id, direction } = await request.json()

    try {
        // 1. Get the item to move
        const { data: itemToMove, error: fetchError } = await supabase
            .from("studio")
            .select("*")
            .eq("id", id)
            .single()

        if (fetchError || !itemToMove) throw new Error("Item not found")

        // 2. Get all items ordered by created_at desc (current order)
        const { data: allItems } = await supabase
            .from("studio")
            .select("id, created_at")
            .order("created_at", { ascending: false })

        if (!allItems) throw new Error("No items found")

        const currentIndex = allItems.findIndex((i) => i.id === id)
        if (currentIndex === -1) throw new Error("Item not found in list")

        // 3. Determine swap target
        const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1

        if (swapIndex < 0 || swapIndex >= allItems.length) {
            return NextResponse.json({ message: "Cannot move further" }, { status: 400 })
        }

        const itemToSwap = allItems[swapIndex]

        // 4. Swap created_at dates
        // optimization: if timestamps are identical, nudge one by a millisecond
        let date1 = new Date(itemToMove.created_at).getTime()
        let date2 = new Date(itemToSwap.created_at).getTime()

        if (date1 === date2) {
            // safe fallback if timestamps collided
            date2 += direction === "up" ? 1000 : -1000
        }

        // Perform the swap
        // To move UP (lower index), we need a NEWER date (larger timestamp)
        // To move DOWN (higher index), we need an OLDER date (smaller timestamp)
        // But we are just swapping the two values effectively.

        // Update Item 1 with Item 2's date
        const { error: update1 } = await supabase
            .from("studio")
            .update({ created_at: new Date(date2).toISOString() })
            .eq("id", itemToMove.id)

        // Update Item 2 with Item 1's date
        const { error: update2 } = await supabase
            .from("studio")
            .update({ created_at: new Date(date1).toISOString() })
            .eq("id", itemToSwap.id)

        if (update1 || update2) throw new Error("Update failed")

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
