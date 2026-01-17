"use client"

import type { Beat } from "@/lib/types"
import { BeatCard } from "@/components/beat-card"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface BestsellerSectionProps {
  beats: Beat[]
}

/**
 * Displays a section of best-selling beats on the homepage. Uses the BeatCard component for each beat and provides
 * navigation to the full shop page.
 */
export function BestsellerSection({ beats }: BestsellerSectionProps) {
  if (!beats || beats.length === 0) {
    return null
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section
      id="bestsellery"
      className="py-24 md:py-32 w-full bg-background"
    >
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 font-sans">Najpopularniejsze</p>
            <h2 className="font-serif text-5xl md:text-6xl font-light text-primary tracking-tight">Bestsellery</h2>
          </div>
          <Link href="/sklep">
            <Button
              variant="outline"
              className="group border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground uppercase tracking-[0.15em] text-xs px-8 py-6 h-auto transition-all duration-300"
            >
              Zobacz Wszystkie
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {beats.map((beat) => (
            <motion.div key={beat.id} variants={itemVariants} whileHover={{ y: -10, transition: { duration: 0.3 } }}>
              <BeatCard beat={beat} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}