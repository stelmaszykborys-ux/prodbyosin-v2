"use client"

import { useCallback } from "react"

interface AddToCartItem {
  beat_id: string
  license_type: "mp3" | "wav" | "stems"
  price: number
}

export function useCart() {
  const getSessionId = () => {
    if (typeof window === "undefined") return ""
    let sessionId = localStorage.getItem("cart_session_id")
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem("cart_session_id", sessionId)
    }
    return sessionId
  }

  const addToCart = useCallback(async (item: AddToCartItem) => {
    try {
      const sessionId = getSessionId()
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...item,
          session_id: sessionId,
        }),
      })

      if (!response.ok) throw new Error("Failed to add to cart")

      // Show success toast or notification
      console.log("Added to cart successfully")
    } catch (error) {
      console.error("Error adding to cart:", error)
    }
  }, [])

  return { addToCart }
}
