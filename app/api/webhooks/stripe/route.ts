import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createAdminClient } from "@/lib/supabase/admin"
import Stripe from "stripe"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

// Helper to send email
async function sendDeliveryEmail(email: string, beatTitle: string, downloadUrl: string, licenseType: string) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'ProdByOsin <noreply@prodbyosin.pl>', // Or a verified domain if available, otherwise testing might strictly require verified sender or test to own email
            // For reliable delivery without domain verification, often 'onboarding@resend.dev' is used for testing to the verified user email.
            // But let's try the user's domain or fallback.
            to: [email],
            subject: `Twój Beat Czeka! - ${beatTitle}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1>Dziękujemy za zakup!</h1>
                    <p>Cześć,</p>
                    <p>Twoje zamówienie na beat <strong>${beatTitle}</strong> (${licenseType}) zostało zrealizowane.</p>
                    <p>Pobierz swoje pliki tutaj:</p>
                    <a href="${downloadUrl}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; display: inline-block; border-radius: 4px; margin: 20px 0;">Pobierz Pliki</a>
                    <p>lub skopiuj ten link: ${downloadUrl}</p>
                    <hr />
                    <p>W razie pytań odpowiedz na tego maila.</p>
                    <p>Pozdrawiamy,<br>ProdByOsin</p>
                </div>
            `
        });

        if (error) {
            console.error("Resend Error:", error)
            return false
        }
        return true
    } catch (e) {
        console.error("Email sending exception:", e)
        return false
    }
}

export async function POST(req: Request) {
    const body = await req.text()
    const signature = headers().get("Stripe-Signature") as string

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
    }

    const session = event.data.object as Stripe.Checkout.Session

    if (event.type === "checkout.session.completed") {
        const supabase = await createAdminClient()

        // 1. Update Order in DB
        const { data: order, error } = await supabase
            .from("orders")
            .update({ status: "completed" })
            .eq("stripe_session_id", session.id)
            .select()
            .single()

        if (error) {
            console.error("Error updating order:", error)
        }

        // 2. Mark beat as sold if exclusive/stems
        // (This logic might already be in 'completeOrder' action, but webhook is safer for async)
        const licenseType = session.metadata?.license_type
        if (licenseType === "stems" || licenseType === "exclusive" || licenseType === "unlimited") {
            const beatId = session.metadata?.beat_id
            if (beatId) {
                await supabase.from("beats").update({ is_sold: true }).eq("id", beatId)
            }
        }

        // 3. Send Email
        if (session.customer_details?.email) {
            const downloadLink = `${process.env.NEXT_PUBLIC_APP_URL}/checkout/sukces?session=${session.id}`
            const beatTitle = session.metadata?.beat_title || "Twój Beat"

            await sendDeliveryEmail(
                session.customer_details.email,
                beatTitle,
                downloadLink,
                licenseType || "Licencja"
            )
        }
    }

    return new NextResponse(null, { status: 200 })
}
