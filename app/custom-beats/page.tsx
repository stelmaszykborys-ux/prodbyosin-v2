import type { Metadata } from "next"
import CustomBeatsClient from "./CustomBeatsClient"

export const metadata: Metadata = {
  title: "Custom Beats | ProdByOsin",
  description: "Zamówienie własnego beatu – opisz swoją wizję i otrzymaj wycenę.",
}

export default function CustomBeatsPage() {
  return <CustomBeatsClient />
}
