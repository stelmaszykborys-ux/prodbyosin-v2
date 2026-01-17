import type React from "react"
import type { Metadata } from "next"
import { VT323, Cormorant_Garamond, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { SmoothScroll } from "@/components/ui/smooth-scroll"
import { CartProvider } from "@/input/cart-provider"

// Use a retro-inspired monospace font for the entire site. This replaces the previous sans font.
const vt323 = VT323({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-vhs",
})

// Retain the serif font for headings where `font-serif` is still used throughout the UI
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
})

// Include the Inter sans-serif font for fallback and to preserve the `font-sans` utility
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})
// </CHANGE>

export const metadata: Metadata = {
  title: "ProdByOsin - Premium Beats & Production",
  description:
    "Profesjonalne beaty i produkcja muzyczna. Minimalistyczny, klimatyczny design. Odkryj wysoką jakość i styl.",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pl" className={`${vt323.variable} ${cormorant.variable} ${inter.variable}`}>
      {/* Apply the VHS font globally via globals.css; only antialias here */}
      <body className="antialiased">
        <SmoothScroll>
          <CartProvider>
            {/* Global 404 motif in top-left and bottom-right corners */}
            <div className="fixed top-4 left-4 text-muted-foreground/40 font-mono text-2xl select-none pointer-events-none z-50">
              404
            </div>
            <div className="fixed bottom-4 right-4 text-muted-foreground/40 font-mono text-2xl select-none pointer-events-none z-50">
              404
            </div>
            {children}
          </CartProvider>
          <Analytics />
        </SmoothScroll>
      </body>
    </html>
  )
}
