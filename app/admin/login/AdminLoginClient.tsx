"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminLoginClient({ redirectTo }: { redirectTo: string }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error

        // Auto-promote if it's the first user or just rely on the manual step later
        // call setup API just in case
        if (data.user) {
          await fetch("/api/admin/setup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: data.user.id }),
          }).catch(() => { }) // ignore error if buckets fail etc
        }
      }

      // Force refresh to ensure cookies are seen by Server Components
      router.refresh()

      // Small delay to allow cookie propagation
      setTimeout(() => {
        router.replace(redirectTo || "/admin")
      }, 500)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Wystąpił błąd")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6 pt-32">
      <div className="w-full max-w-md">
        <Card className="bg-card/70 backdrop-blur-sm border border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="font-serif text-3xl text-primary">
              {isLogin ? "Panel Admina" : "Rejestracja"}
            </CardTitle>
            <CardDescription>
              {isLogin ? "Zaloguj się, aby zarządzać stroną" : "Utwórz konto administratora"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-wider">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@prodbyosin.pl"
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs uppercase tracking-wider">
                  Hasło
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background/50"
                  minLength={6}
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-[0.15em]"
              >
                {isLoading
                  ? (isLogin ? "Logowanie..." : "Rejestracja...")
                  : (isLogin ? "Zaloguj się" : "Utwórz konto")}
              </Button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-xs text-muted-foreground hover:text-primary underline"
                >
                  {isLogin ? "Nie masz konta? Zarejestruj się" : "Masz już konto? Zaloguj się"}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
                Powrót do strony głównej
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
