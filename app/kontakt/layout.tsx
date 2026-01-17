import type React from "react"
import { PageTransitionWrapper } from "@/components/page-transition-wrapper"

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <PageTransitionWrapper>{children}</PageTransitionWrapper>
}
