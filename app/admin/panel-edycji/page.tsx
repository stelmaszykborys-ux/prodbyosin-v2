import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, ShoppingCart, Video, FileText, User, ArrowLeft, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
    title: "Panel Edycji | Admin",
}

export default async function EditPanelPage() {
    const supabase = await createClient()

    return (
        <div className="space-y-8 max-w-5xl mx-auto py-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-3xl text-primary">Szybki Panel Edycji</h1>
                    <p className="text-muted-foreground">Wszystko w jednym miejscu.</p>
                </div>
                <Link href="/admin">
                    <Button variant="outline">
                        <ArrowLeft size={16} className="mr-2" /> Wróć do Pełnego Panelu
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6">

                {/* ADD NEW */}
                <section className="space-y-4">
                    <h2 className="text-lg font-medium border-b border-border pb-2">Dodaj Nowe Rzeczy</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Link href="/admin/beaty/nowy" className="group">
                            <Card className="h-full bg-primary/10 border-primary/20 hover:bg-primary/20 transition-all cursor-pointer">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3 text-2xl group-hover:text-primary">
                                        <div className="p-3 bg-primary text-primary-foreground rounded-full shadow-lg">
                                            <Plus size={24} />
                                        </div>
                                        Dodaj Beat
                                    </CardTitle>
                                    <CardDescription>Prześlij pliki i ustaw cenę.</CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                        <Link href="/admin/drops/nowy" className="group">
                            <Card className="h-full bg-secondary/10 border-secondary/20 hover:bg-secondary/20 transition-all cursor-pointer">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3 text-2xl group-hover:text-primary">
                                        <div className="p-3 bg-secondary text-secondary-foreground rounded-md shadow-lg">
                                            <ShoppingCart size={24} />
                                        </div>
                                        Dodaj Drop
                                    </CardTitle>
                                    <CardDescription>Dodaj paczkę lub produkt.</CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                    </div>
                </section>

                {/* EDIT CONTENT */}
                <section className="space-y-4 pt-4">
                    <h2 className="text-lg font-medium border-b border-border pb-2">Edytuj Treści Na Stronie</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Link href="/admin/studio" className="group">
                            <Card className="h-full hover:border-primary/50 transition-colors">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Video size={18} /> Studio</CardTitle>
                                    <CardDescription>Twoja galeria zdjęć i filmów.</CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                        <Link href="/admin/strony/sklep" className="group">
                            <Card className="h-full hover:border-primary/50 transition-colors">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><FileText size={18} /> Opis Sklepu</CardTitle>
                                    <CardDescription>Nagłówek i tekst na stronie głównej sklepu.</CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                        <Link href="/admin/o-mnie" className="group">
                            <Card className="h-full hover:border-primary/50 transition-colors">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><User size={18} /> O Mnie</CardTitle>
                                    <CardDescription>Twój opis biograficzny.</CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                    </div>
                </section>

            </div>
        </div>
    )
}
