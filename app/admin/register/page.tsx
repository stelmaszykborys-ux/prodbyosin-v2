"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function RegisterPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const router = useRouter()

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage("")

        const supabase = createClient()

        try {
            // 1. Sign up
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            })

            if (error) throw error
            if (!data.user) throw new Error("No user created")

            // 2. Promote to Admin (Server-side)
            const res = await fetch("/api/admin/setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: data.user.id }),
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || "Failed to promote to admin")
            }

            setMessage("Account created and promoted! Redirecting...")
            setTimeout(() => router.push("/admin"), 2000)

        } catch (err: any) {
            setMessage("Error: " + err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Admin Setup</CardTitle>
                    <CardDescription>Create a new admin account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Creating..." : "Create Admin Account"}
                        </Button>
                        {message && <p className="text-sm text-center mt-2">{message}</p>}
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
