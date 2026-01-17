import { Navigation } from "@/components/navigation"
import AdminLoginClient from "./AdminLoginClient"

export const metadata = {
  title: "Admin Login | ProdByOsin",
  description: "Logowanie do panelu administratora.",
}

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const redirectRaw = searchParams?.redirect
  const redirectTo =
    typeof redirectRaw === "string" && redirectRaw.trim().length > 0 ? redirectRaw : "/admin"

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <AdminLoginClient redirectTo={redirectTo} />
    </main>
  )
}
