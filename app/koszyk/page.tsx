import { CartPage } from "@/components/cart-page"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function Cart() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <CartPage />
      <Footer />
    </main>
  )
}
