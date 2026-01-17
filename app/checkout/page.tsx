import { Navigation } from "@/components/navigation"
import { CheckoutPage as CheckoutPageComponent } from "@/components/checkout-page"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Kasa | ProdByOsin",
}

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <CheckoutPageComponent />
      <Footer />
    </main>
  )
}
