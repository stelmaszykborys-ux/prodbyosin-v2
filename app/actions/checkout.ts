"use server"

import { stripe } from "@/lib/stripe"
import { createAdminClient } from "@/lib/supabase/admin"
import type { CartItem } from "@/lib/types"

interface CheckoutSessionParams {
  cartItems: CartItem[]
  total: number
  sessionId: string
  email: string
  name: string
  phone?: string
  paymentType: "card" | "blik"
}

export async function createCheckoutSession(params: CheckoutSessionParams) {
  const { cartItems, total, sessionId, email, name, paymentType } = params

  // Build line items from cart
  const lineItems = cartItems.map((item) => ({
    price_data: {
      currency: "pln",
      product_data: {
        name: `Beat #${item.beat_id.slice(0, 8)}`,
        description: `License: ${item.license_type.toUpperCase()}`,
      },
      unit_amount: item.price,
    },
    quantity: 1,
  }))

  // Fetch first beat to get downloadable content info (MVP: single item or first item)
  const supabaseAdmin = await createAdminClient()
  const { data: beat } = await supabaseAdmin
    .from("beats")
    .select("slug")
    .eq("id", cartItems[0].beat_id)
    .single()

  // Create Stripe session with payment methods
  const session = await stripe.checkout.sessions.create({
    payment_method_types: paymentType === "blik" ? ["blik"] : ["card"],
    mode: "payment",
    customer_email: email,
    line_items: lineItems,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/sukces?session={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/koszyk`,
    metadata: {
      cart_session_id: sessionId,
      customer_name: name,
      items_count: cartItems.length.toString(),
      beat_slug: beat?.slug || "", // Store slug for success page
      license_type: cartItems[0].license_type, // Store license type for immediate access
    },
  })

  // Create order in database using admin client to bypass RLS
  const supabase = await createAdminClient()

  // Insert order with all cart items
  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      customer_email: email,
      customer_name: name,
      license_type: cartItems[0].license_type, // Primary license
      price_paid: total,
      stripe_session_id: session.id,
      status: "pending",
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating order:", error)
    throw new Error("Nie udało się utworzyć zamówienia")
  }

  return {
    url: session.url,
  }
}

export async function getCheckoutStatus(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId)

  let licenseType = "mp3" // Default

  if (session.payment_status === "paid" || session.status === "complete") {
    const supabase = await createAdminClient()

    // Update order status and fetch license type
    const { data: order } = await supabase
      .from("orders")
      .update({ status: "completed" })
      .eq("stripe_session_id", sessionId)
      .select("license_type")
      .single()

    if (order) {
      licenseType = order.license_type
    }
  }

  return {
    status: session.payment_status,
    customerEmail: session.customer_details?.email,
    amount: session.amount_total,
    beatSlug: session.metadata?.beat_slug,
    licenseType: session.metadata?.license_type || licenseType, // Prefer metadata for speed and reliability, fallback to DB default
  }
}
