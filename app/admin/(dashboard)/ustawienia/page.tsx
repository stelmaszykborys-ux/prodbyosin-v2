"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Loader2, Globe, Mail, CreditCard, Bell } from "lucide-react"

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-primary">Ustawienia</h1>
        <p className="text-muted-foreground">Konfiguracja strony i sklepu</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-card/50 border border-border/50">
          <TabsTrigger
            value="general"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Globe size={16} className="mr-2" />
            Ogólne
          </TabsTrigger>
          <TabsTrigger
            value="contact"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Mail size={16} className="mr-2" />
            Kontakt
          </TabsTrigger>
          <TabsTrigger
            value="payments"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <CreditCard size={16} className="mr-2" />
            Płatności
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Bell size={16} className="mr-2" />
            Powiadomienia
          </TabsTrigger>
        </TabsList>

        <form onSubmit={handleSave}>
          <TabsContent value="general" className="space-y-6">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Informacje o stronie</CardTitle>
                <CardDescription>Podstawowe informacje widoczne na stronie</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="site_name">Nazwa strony</Label>
                    <Input id="site_name" defaultValue="prodbyosin" className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site_tagline">Tagline</Label>
                    <Input id="site_tagline" defaultValue="Premium Beats & Production" className="bg-background/50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site_description">Opis (SEO)</Label>
                  <Textarea
                    id="site_description"
                    defaultValue="Profesjonalne beaty i produkcja muzyczna. Minimalistyczny, klimatyczny design. Odkryj wysoką jakość i styl."
                    rows={3}
                    className="bg-background/50 resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
                <CardDescription>Linki do profili w mediach społecznościowych</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input id="instagram" placeholder="@prodbyosin" className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="youtube">YouTube</Label>
                    <Input id="youtube" placeholder="youtube.com/prodbyosin" className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="soundcloud">SoundCloud</Label>
                    <Input id="soundcloud" placeholder="soundcloud.com/prodbyosin" className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="beatstars">BeatStars</Label>
                    <Input id="beatstars" placeholder="beatstars.com/prodbyosin" className="bg-background/50" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Dane kontaktowe</CardTitle>
                <CardDescription>Informacje wyświetlane na stronie kontaktowej</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Email kontaktowy</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    defaultValue="kontakt@prodbyosin.pl"
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_response_time">Czas odpowiedzi</Label>
                  <Input id="contact_response_time" defaultValue="24 godziny" className="bg-background/50" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Stripe</CardTitle>
                <CardDescription>Konfiguracja płatności Stripe</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/30 rounded-sm">
                  <div>
                    <p className="text-sm font-medium text-green-500">Stripe połączony</p>
                    <p className="text-xs text-muted-foreground">Płatności są aktywne</p>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
                <div className="space-y-2">
                  <Label>Domyślna waluta</Label>
                  <Input value="PLN" disabled className="bg-background/50" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Domyślne ceny licencji</CardTitle>
                <CardDescription>Ceny stosowane dla nowych beatów</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="default_price_mp3">MP3</Label>
                  <Input id="default_price_mp3" type="number" defaultValue="150" className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default_price_wav">WAV</Label>
                  <Input id="default_price_wav" type="number" defaultValue="250" className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default_price_stems">Stems</Label>
                  <Input id="default_price_stems" type="number" defaultValue="450" className="bg-background/50" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Powiadomienia email</CardTitle>
                <CardDescription>Wybierz, o czym chcesz być informowany</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Nowe zamówienie</Label>
                    <p className="text-xs text-muted-foreground">Otrzymuj email przy każdym nowym zamówieniu</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Nowa wiadomość kontaktowa</Label>
                    <p className="text-xs text-muted-foreground">Otrzymuj email z formularza kontaktowego</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Raport tygodniowy</Label>
                    <p className="text-xs text-muted-foreground">Podsumowanie sprzedaży co tydzień</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Save Button */}
          <div className="flex items-center justify-end gap-4 pt-6">
            {saved && <span className="text-sm text-green-500">Zapisano pomyślnie!</span>}
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Zapisywanie...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Zapisz ustawienia
                </>
              )}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  )
}
