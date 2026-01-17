import { Navigation } from "@/components/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { FAQForm } from "@/components/admin/faq-form"

export const metadata = {
  title: "Nowe FAQ | Admin",
}

/**
 * Page for creating a new FAQ item in the admin panel.
 */
export default function NewFAQPage() {
  return (
    <>
      <Navigation />
      <div className="pt-32 pb-12 px-6 lg:px-12">
        <div className="container mx-auto max-w-2xl">
          <h1 className="font-serif text-4xl font-light text-primary mb-8">Nowe pytanie FAQ</h1>
          <FAQForm />
        </div>
      </div>
    </>
  )
}