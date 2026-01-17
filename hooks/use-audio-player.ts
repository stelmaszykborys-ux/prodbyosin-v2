"use client"

import { useState, useEffect, useRef } from "react"
import type { Beat } from "@/lib/types"

export function useAudioPlayer() {
    const [currentlyPlaying, setCurrentlyPlaying] = useState<Beat | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio()
            audioRef.current.onended = () => {
                setIsPlaying(false)
                setCurrentlyPlaying(null)
            }
        }

        const audio = audioRef.current

        if (currentlyPlaying) {
            if (audio.src !== currentlyPlaying.audio_preview_url) {
                audio.src = currentlyPlaying.audio_preview_url || ""
                audio.load()
            }

            const playPromise = audio.play()
            if (playPromise !== undefined) {
                playPromise
                    .then(() => setIsPlaying(true))
                    .catch(error => {
                        console.error("Audio playback failed:", error)
                        setIsPlaying(false)
                    })
            }
        } else {
            audio.pause()
            setIsPlaying(false)
        }

        return () => {
            // Cleanup if needed, though we usually want the player to persist
        }
    }, [currentlyPlaying])

    const togglePlay = (beat: Beat) => {
        if (currentlyPlaying?.id === beat.id) {
            if (isPlaying) {
                setCurrentlyPlaying(null) // Or just pause: audioRef.current.pause(); setIsPlaying(false);
            } else {
                setCurrentlyPlaying(beat)
            }
        } else {
            setCurrentlyPlaying(beat)
        }
    }

    return {
        currentlyPlaying,
        isPlaying,
        togglePlay,
    }
}
