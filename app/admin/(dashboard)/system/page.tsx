import { createClient } from "@/lib/supabase/server"
import { createClient as createBrowserClient } from "@supabase/supabase-js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, AlertTriangle, RefreshCw, Database, Shield, HardDrive } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
    title: "Stan Systemu | Admin Panel",
}

export default async function SystemHealthPage() {
    const supabase = await createClient()

    // 1. Check Admin Access (Implicity checked by being here, but good to show)
    const { data: { user } } = await supabase.auth.getUser()

    // 2. Check Database Connection & RLS (Admin View)
    const { count: adminBeatsCount, error: adminDbError } = await supabase.from("beats").select("*", { count: "exact", head: true })

    // 3. Check Public Access (Simulate Anon User)
    // We use the raw supabase-js client here to simulate a request WITHOUT cookies/auth
    const publicClient = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { count: publicBeatsCount, error: publicDbError } = await publicClient.from("beats").select("*", { count: "exact", head: true }).eq("is_published", true)

    // 4. Check Storage Buckets
    const buckets = ["beats", "covers", "studio", "drops"]
    const bucketStatus = await Promise.all(
        buckets.map(async (name) => {
            const { data, error } = await supabase.storage.getBucket(name)
            return { name, exists: !error && !!data, public: data?.public ?? false }
        })
    )

    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-serif text-3xl text-primary">Stan Systemu</h1>
                <p className="text-muted-foreground">Diagnostyka połączeń i uprawnień Supabase.</p>
            </div>

            <div className="grid gap-6">

                {/* Database Connectivity */}
                <Card className="bg-card/40 border-border/50">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-md text-primary">
                            <Database size={24} />
                        </div>
                        <div>
                            <CardTitle>Baza Danych</CardTitle>
                            <CardDescription>Status połączenia z Supabase</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-secondary/30 rounded border border-border/30">
                            <span>Połączenie Admina</span>
                            {adminDbError ? (
                                <span className="flex items-center text-destructive gap-2 text-sm font-bold"><XCircle size={16} /> Błąd: {adminDbError.message}</span>
                            ) : (
                                <span className="flex items-center text-green-500 gap-2 text-sm font-bold"><CheckCircle2 size={16} /> OK ({adminBeatsCount} beatów)</span>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* RLS & Public Visibility */}
                <Card className="bg-card/40 border-border/50">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-md text-primary">
                            <Shield size={24} />
                        </div>
                        <div>
                            <CardTitle>Uprawnienia Publiczne (RLS)</CardTitle>
                            <CardDescription>Czy klienci widzą Twoje produkty?</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-secondary/30 rounded border border-border/30">
                            <span>Widoczność Beatów (Public API)</span>
                            {publicDbError ? (
                                <span className="flex items-center text-destructive gap-2 text-sm font-bold"><XCircle size={16} /> Błąd: {publicDbError.message}</span>
                            ) : (
                                <span className="flex items-center text-green-500 gap-2 text-sm font-bold"><CheckCircle2 size={16} /> OK ({publicBeatsCount} widocznych)</span>
                            )}
                        </div>

                        {publicBeatsCount === 0 && adminBeatsCount! > 0 && !publicDbError && (
                            <div className="p-4 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded text-sm flex items-start gap-3">
                                <AlertTriangle className="shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold">Uwaga: Brak publicznych beatów</p>
                                    <p className="mt-1">Masz beaty w bazie, ale publicznie widać 0. Może to oznaczać:</p>
                                    <ul className="list-disc list-inside mt-2 space-y-1">
                                        <li>Żaden beat nie ma statusu "is_published = true"</li>
                                        <li>Brak polityki RLS "Select" dla tabeli beats (Najczęstszy powód)</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Storage Buckets */}
                <Card className="bg-card/40 border-border/50">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-md text-primary">
                            <HardDrive size={24} />
                        </div>
                        <div>
                            <CardTitle>Magazyn Plików (Storage)</CardTitle>
                            <CardDescription>Status bucketów na pliki</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {bucketStatus.map((bucket) => (
                                <div key={bucket.name} className="flex items-center justify-between p-3 bg-secondary/30 rounded border border-border/30">
                                    <span className="font-mono text-sm">{bucket.name}</span>
                                    {bucket.exists ? (
                                        <span className="flex items-center text-green-500 gap-2 text-xs font-bold">
                                            {bucket.public ? "PUBLIC" : "PRIVATE"} <CheckCircle2 size={14} />
                                        </span>
                                    ) : (
                                        <span className="flex items-center text-destructive gap-2 text-xs font-bold">
                                            MISSING <XCircle size={14} />
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}
