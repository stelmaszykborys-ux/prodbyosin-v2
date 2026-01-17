import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus, Shield, Trash2 } from "lucide-react"

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const { data: admins } = await supabase.from("admins").select("*")

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-primary">Użytkownicy</h1>
          <p className="text-muted-foreground">Zarządzaj administratorami</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <UserPlus size={16} className="mr-2" />
          Dodaj admina
        </Button>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle>Administratorzy</CardTitle>
        </CardHeader>
        <CardContent>
          {admins && admins.length > 0 ? (
            <div className="space-y-4">
              {admins.map((admin) => (
                <div
                  key={admin.id}
                  className="flex items-center justify-between p-4 bg-muted/20 rounded-sm border border-border/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Shield size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{admin.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Dodany: {new Date(admin.created_at).toLocaleDateString("pl-PL")}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive">
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-8">Brak administratorów</p>
          )}
        </CardContent>
      </Card>

      <Card className="bg-yellow-500/10 border-yellow-500/30">
        <CardContent className="py-4">
          <p className="text-sm text-yellow-500">
            <strong>Uwaga:</strong> Aby dodać pierwszego admina, musisz ręcznie dodać wpis do tabeli{" "}
            <code className="bg-yellow-500/20 px-1 rounded">admins</code> z ID użytkownika z tabeli{" "}
            <code className="bg-yellow-500/20 px-1 rounded">auth.users</code>.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
