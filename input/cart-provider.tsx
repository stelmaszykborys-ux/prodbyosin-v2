"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface CartContextType {
    cartCount: number
    refreshCart: () => Promise<void>
    addToCart: (item: any) => Promise<void>
    removeFromCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartCount, setCartCount] = useState(0)

    const getSessionId = () => {
        if (typeof window === "undefined") return ""
        let sessionId = localStorage.getItem("cart_session_id")
        if (!sessionId) {
            sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            localStorage.setItem("cart_session_id", sessionId)
        }
        return sessionId
    }

    const refreshCart = async () => {
        try {
            const sessionId = getSessionId()
            if (!sessionId) return
            const storedCount = localStorage.getItem("cart_count")
            setCartCount(storedCount ? parseInt(storedCount) : 0)
        } catch (e) {
            console.error("Failed to refresh cart", e)
        }
    }

    const addToCart = async (item: any) => {
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

            if (!response.ok) throw new Error("Failed increase cart")

            setCartCount((prev) => {
                const newCount = prev + 1
                localStorage.setItem("cart_count", newCount.toString())
                return newCount
            })

        } catch (error) {
            console.error("Error adding to cart:", error)
        }
    }

    const removeFromCart = () => {
        setCartCount((prev) => {
            const newCount = Math.max(0, prev - 1)
            localStorage.setItem("cart_count", newCount.toString())
            return newCount
        })
    }

    useEffect(() => {
        refreshCart()
    }, [])

    return (
        <CartContext.Provider value={{ cartCount, refreshCart, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}
