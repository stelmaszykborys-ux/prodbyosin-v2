"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2, ShieldCheck } from "lucide-react"

export function AdminOnboarding({ userId }: { userId: string }) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const handlePromote = async () => {
        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/admin/setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            })

            if (!res.ok) {
                throw new Error("Failed to promote user")
            }

            // Refresh to re-run the layout check
            router.refresh()
        } catch (err) {
            setError("Something went wrong. Contact support.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="bg-secondary/50 p-4 rounded text-xs font-mono mb-2 break-all max-w-[300px]">
                ID: <span className="text-primary font-bold">{userId}</span>
            </div>

            <Button
                onClick={handlePromote}
                disabled={loading}
                size="lg"
                className="uppercase tracking-widest font-bold gap-2"
            >
                {loading ? (
                    <>
                        <Loader2 className="animate-spin" size={16} />
                        Setting up...
                    </>
                ) : (
                    <>
                        <ShieldCheck size={16} />
                        Make me Admin
                    </>
                )}
            </Button>

            {error && <p className="text-destructive text-sm">{error}</p>}
            <p className="text-xs text-muted-foreground mt-4">
                Clicking this will explicitly grant your account Admin privileges.
            </p>
        </div>
    )
}
