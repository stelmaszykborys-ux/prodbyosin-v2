"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus, Trash2, Upload, Save, User as UserIcon } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

interface CollabMember {
    id: string
    name: string
    role: "producer" | "artist"
    image_url: string
}

interface CollabManagerProps {
    initialData: CollabMember[]
}

export function CollabManager({ initialData }: CollabManagerProps) {
    const router = useRouter()
    const [members, setMembers] = useState<CollabMember[]>(initialData)
    const [isLoading, setIsLoading] = useState(false)
    const [uploading, setUploading] = useState(false)

    // New member state
    const [newName, setNewName] = useState("")
    const [newRole, setNewRole] = useState<"producer" | "artist">("producer")
    const [newImage, setNewImage] = useState("")
    const [imageFile, setImageFile] = useState<File | null>(null)

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        try {
            const supabase = createClient()
            const fileExt = file.name.split(".").pop()
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
            const filePath = `collab/${fileName}`

            const { error: uploadError } = await supabase.storage.from("site-assets").upload(filePath, file)
            if (uploadError) throw uploadError

            const { data } = supabase.storage.from("site-assets").getPublicUrl(filePath)
            setNewImage(data.publicUrl)
        } catch (err) {
            console.error("Upload failed", err)
            alert("Błąd przesyłania zdjęcia")
        } finally {
            setUploading(false)
        }
    }

    const addMember = () => {
        if (!newName) return alert("Podaj nazwę")

        const newMember: CollabMember = {
            id: Math.random().toString(36).substring(2, 9),
            name: newName,
            role: newRole,
            image_url: newImage || "/placeholder-user.jpg"
        }

        setMembers([...members, newMember])
        // Reset form
        setNewName("")
        setNewImage("")
        setImageFile(null)
    }

    const removeMember = (id: string) => {
        setMembers(members.filter(m => m.id !== id))
    }

    // Removes common placeholder / fake entries (safe, non-destructive for real names/images).
    const clearPlaceholders = () => {
        const cleaned = members.filter((m) => {
            const name = (m.name || "").toLowerCase()
            const img = (m.image_url || "").toLowerCase()
            const looksFakeName = name.includes("placeholder") || name.includes("dummy") || name.includes("example") || name.includes("young producer")
            const looksPlaceholderImg = img.includes("placeholder") || img.includes("dummy") || img.includes("example") || img.endsWith("/placeholder-user.jpg")
            return !(looksFakeName || looksPlaceholderImg)
        })
        setMembers(cleaned)
    }

    const saveChanges = async () => {
        setIsLoading(true)
        try {
            const response = await fetch("/api/admin/settings/collab", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ members }),
            })

            if (!response.ok) throw new Error("Failed to save")

            router.refresh()
            alert("Zapisano zmiany!")
        } catch (error) {
            console.error(error)
            alert("Wystąpił błąd podczas zapisywania")
        } finally {
            setIsLoading(false)
        }
    }

    const producers = members.filter(m => m.role === "producer")
    const artists = members.filter(m => m.role === "artist")

    return (
        <div className="space-y-8">
            {/* Add New Section */}
            <Card className="bg-card/30 border-border/50">
                <CardHeader>
                    <CardTitle>Dodaj nowego współpracownika</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div className="space-y-2">
                            <Label>Nazwa / Ksywa</Label>
                            <Input
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                placeholder="np. Young Producer"
                                className="bg-background/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Rola</Label>
                            <select
                                value={newRole}
                                onChange={e => setNewRole(e.target.value as "producer" | "artist")}
                                className="w-full h-10 px-3 rounded-md border border-input bg-background/50 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <option value="producer">Producent</option>
                                <option value="artist">Artysta</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Zdjęcie</Label>
                            <div className="flex gap-2">
                                <div className="relative w-10 h-10 bg-secondary rounded overflow-hidden shrink-0 flex items-center justify-center">
                                    {newImage ? (
                                        <img src={newImage} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <UserIcon className="w-5 h-5 opacity-50" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <label className="flex items-center justify-center w-full h-10 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md cursor-pointer text-sm font-medium transition-colors">
                                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                                        {uploading ? "Przesyłanie..." : "Wybierz plik"}
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button onClick={addMember} disabled={!newName || uploading} className="w-full md:w-auto">
                        <Plus className="w-4 h-4 mr-2" /> Dodaj do listy
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={clearPlaceholders}
                        className="w-full md:w-auto"
                    >
                        Usuń fejkowe / placeholdery
                    </Button>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Producers List */}
                <div className="space-y-4">
                    <h3 className="font-serif text-2xl text-primary">Producenci</h3>
                    {producers.length === 0 && <p className="text-muted-foreground text-sm">Brak producentów.</p>}
                    <div className="space-y-2">
                        {producers.map(member => (
                            <div key={member.id} className="flex items-center justify-between p-3 bg-card/20 rounded border border-border/30">
                                <div className="flex items-center gap-3">
                                    <img src={member.image_url} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                                    <span className="font-medium">{member.name}</span>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => removeMember(member.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Artists List */}
                <div className="space-y-4">
                    <h3 className="font-serif text-2xl text-primary">Artyści</h3>
                    {artists.length === 0 && <p className="text-muted-foreground text-sm">Brak artystów.</p>}
                    <div className="space-y-2">
                        {artists.map(member => (
                            <div key={member.id} className="flex items-center justify-between p-3 bg-card/20 rounded border border-border/30">
                                <div className="flex items-center gap-3">
                                    <img src={member.image_url} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                                    <span className="font-medium">{member.name}</span>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => removeMember(member.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="fixed bottom-6 right-6 md:bottom-12 md:right-12">
                <Button onClick={saveChanges} disabled={isLoading} size="lg" className="shadow-lg uppercase tracking-wider font-bold">
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                    Zapisz Zmiany
                </Button>
            </div>
        </div>
    )
}
