"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { AnimatedText } from "./ui/animated-text"
import { ArrowRight } from "lucide-react"

export function VideoHero() {
  const [isLoaded, setIsLoaded] = useState(false)
  const videoIndex = 0
  const videos = ["/hero.mp4"]
  const videoRef = useRef<HTMLVideoElement>(null)

  // Parallax effect for video
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 200])
  const opacity = useTransform(scrollY, [0, 300], [1, 0.5])

  // Glitch text states
  const glitchTexts = ["ProdByOsin", "TWO MINDS"]
  const [glitchIndex, setGlitchIndex] = useState(0)

  useEffect(() => {
    setIsLoaded(true)
    const interval = setInterval(() => {
      setGlitchIndex((prev) => (prev + 1) % glitchTexts.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* Background video with parallax */}
      <motion.div style={{ y, opacity }} className="absolute inset-0 w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={videoIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover scale-110"
              poster="/music-production-studio-beats.jpg"
            >
              <source src={videos[videoIndex]} type="video/mp4" />
            </video>
          </motion.div>
        </AnimatePresence>

        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="sr-only">ProdByOsin</h1>
            <div className="relative h-24 md:h-32 lg:h-40 overflow-hidden mb-6 flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={glitchIndex}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute left-0"
                >
                  <span
                    className="font-serif font-light text-6xl md:text-8xl lg:text-9xl tracking-tighter uppercase text-white mix-blend-difference"
                    style={{
                      textShadow: "0 0 30px rgba(255,255,255,0.3)"
                    }}
                  >
                    {glitchTexts[glitchIndex]}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="h-px w-24 bg-primary/50 mb-8" />

            <AnimatedText
              text="Sound over everything"
              className="text-lg md:text-xl text-neutral-300 max-w-lg mb-10 font-light tracking-wide"
            />

            {/* CTA Buttons */}
            <motion.div
              className="flex gap-6 flex-wrap items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <a
                href="/sklep"
                className="group relative px-8 py-4 bg-primary text-primary-foreground font-semibold uppercase tracking-widest text-xs overflow-hidden rounded-sm"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Choose your sound <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-white"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="absolute inset-0 z-20 flex items-center justify-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  Choose your sound <ArrowRight className="w-4 h-4 translate-x-1" />
                </span>
              </a>

              <a
                href="/studio"
                className="px-8 py-4 bg-transparent border border-white/20 text-white font-semibold uppercase tracking-widest text-xs hover:bg-white/5 hover:border-white/50 transition-all duration-300 backdrop-blur-sm rounded-sm"
              >
                Studio
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Video selector dots */}


    </section>
  )
}
