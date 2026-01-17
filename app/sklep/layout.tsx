import type React from "react"
import { PageTransitionWrapper } from "@/components/page-transition-wrapper"

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <PageTransitionWrapper>{children}</PageTransitionWrapper>
}
