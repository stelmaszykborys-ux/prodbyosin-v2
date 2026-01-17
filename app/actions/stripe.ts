"use server"

import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import type { LicenseType } from "@/lib/types"

interface CheckoutParams {
  beatId: string
  licenseType: LicenseType
  customerEmail?: string
}

export async function startCheckoutSession({ beatId, licenseType, customerEmail }: CheckoutParams) {
  const supabase = await createClient()

  // Fetch beat from database
  const { data: beat, error } = await supabase.from("beats").select("*").eq("id", beatId).single()

  if (error || !beat) {
    throw new Error("Beat nie został znaleziony")
  }

  if (beat.is_sold) {
    throw new Error("Ten beat został już sprzedany")
  }

  // Get price based on license type
  const priceMap: Record<LicenseType, number> = {
    mp3: beat.price_mp3,
    wav: beat.price_wav,
    stems: beat.price_stems,
  }

  const licenseName: Record<LicenseType, string> = {
    mp3: "Licencja MP3",
    wav: "Licencja WAV",
    stems: "Licencja Stems (Exclusive)",
  }

  const price = priceMap[licenseType]

  // Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    customer_email: customerEmail,
    line_items: [
      {
        price_data: {
          currency: "pln",
          product_data: {
            name: beat.title,
            description: `${licenseName[licenseType]} - ${beat.bpm || "?"} BPM, ${beat.key || "?"}, ${beat.genre || "Beat"}`,
          },
          unit_amount: price,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      beat_id: beatId,
      license_type: licenseType,
      beat_title: beat.title,
    },
  })

  return {
    clientSecret: session.client_secret,
    sessionId: session.id,
  }
}

export async function getSessionStatus(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId)

  return {
    status: session.status,
    customerEmail: session.customer_details?.email,
    paymentStatus: session.payment_status,
    metadata: session.metadata,
  }
}

export async function completeOrder(sessionId: string) {
  const supabase = await createClient()

  // Get session details from Stripe
  const session = await stripe.checkout.sessions.retrieve(sessionId)

  if (session.payment_status !== "paid") {
    throw new Error("Płatność nie została zrealizowana")
  }

  const beatId = session.metadata?.beat_id
  const licenseType = session.metadata?.license_type as LicenseType
  const customerEmail = session.customer_details?.email

  if (!beatId || !licenseType || !customerEmail) {
    throw new Error("Brakujące dane zamówienia")
  }

  // Check if order already exists
  const { data: existingOrder } = await supabase.from("orders").select("id").eq("stripe_session_id", sessionId).single()

  if (existingOrder) {
    return { orderId: existingOrder.id, alreadyExists: true }
  }

  // Create order in database
  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      beat_id: beatId,
      customer_email: customerEmail,
      customer_name: session.customer_details?.name || null,
      license_type: licenseType,
      price_paid: session.amount_total || 0,
      stripe_payment_id: session.payment_intent as string,
      stripe_session_id: sessionId,
      status: "completed",
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating order:", error)
    throw new Error("Nie udało się utworzyć zamówienia")
  }

  // If stems license, mark beat as sold (exclusive)
  if (licenseType === "stems") {
    await supabase.from("beats").update({ is_sold: true }).eq("id", beatId)
  }

  return { orderId: order.id, alreadyExists: false }
}
