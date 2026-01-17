import { Navigation } from "@/components/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { DropForm } from "@/components/admin/drop-form"

export const metadata = {
  title: "Nowy Drop | Admin",
}

export default function NewDropPage() {
  return (
    <>
      <Navigation />
      <div className="pt-32 pb-12 px-6 lg:px-12">
        <div className="container mx-auto max-w-2xl">
          <h1 className="font-serif text-4xl font-light text-primary mb-8">Nowy Drop</h1>
          <DropForm />
        </div>
      </div>
    </>
  )
}
