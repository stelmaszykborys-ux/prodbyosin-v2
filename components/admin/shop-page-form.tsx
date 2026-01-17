"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface ShopSettings {
    title: string
    description: string
    header_label: string
}

export function ShopPageForm({ initialData }: { initialData?: ShopSettings }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<ShopSettings>({
        title: initialData?.title || "Sklep",
        description: initialData?.description || "Wybierz beat idealny dla Twojego projektu.",
        header_label: initialData?.header_label || "KATALOG BEATÓW"
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch("/api/admin/settings/shop", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (!response.ok) throw new Error("Failed to save")

            router.refresh()
            alert("Zapisano zmiany!")
        } catch (error) {
            console.error(error)
            alert("Błąd zapisu")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <Link href="/admin/strony" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft size={16} className="mr-2" />
                Powrót do listy stron
            </Link>

            <form onSubmit={handleSubmit}>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader>
                        <CardTitle>Edycja Strony: Sklep</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Mały Nagłówek (Label)</Label>
                            <Input
                                value={formData.header_label}
                                onChange={e => setFormData({ ...formData, header_label: e.target.value })}
                                placeholder="np. KATALOG BEATÓW"
                                className="bg-background/50"
                            />
                            <p className="text-xs text-muted-foreground">Mały tekst nad głównym tytułem (wielkie litery).</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Główny Tytuł</Label>
                            <Input
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="np. Sklep"
                                className="bg-background/50 font-serif text-lg"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Opis Pod Tytułem</Label>
                            <Textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Opis strony..."
                                rows={4}
                                className="bg-background/50"
                            />
                        </div>

                        <Button type="submit" disabled={loading} className="w-full md:w-auto uppercase tracking-wider">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Zapisz Zmiany
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </div>
    )
}
