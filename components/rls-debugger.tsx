"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function RLSDebugger() {
    const [status, setStatus] = useState("Checking...")
    const [error, setError] = useState<any>(null)
    const [count, setCount] = useState<number | null>(null)

    useEffect(() => {
        async function check() {
            const supabase = createClient()
            const { data, error, count } = await supabase
                .from("beats")
                .select("*", { count: "exact", head: true })

            if (error) {
                setError(error)
                setStatus("Error")
            } else {
                setCount(count)
                setStatus("Success")
            }
        }
        check()
    }, [])

    return (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 text-xs rounded border border-white/20 z-50">
            <p>RLS Status: {status}</p>
            {count !== null && <p>Beats found: {count}</p>}
            {error && <pre className="text-red-400 mt-2">{JSON.stringify(error, null, 2)}</pre>}
        </div>
    )
}
