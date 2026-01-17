"use server"

import { stripe } from "@/lib/stripe"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrderEmail(sessionId: string) {
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId)

        if (session.payment_status !== "paid") {
            return { success: false, error: "Payment not confirmed" }
        }

        const email = session.customer_details?.email
        const metadata = session.metadata || {}
        const beatTitle = metadata.beat_title || "Twój Beat"
        const licenseType = metadata.license_type || "Licencja"
        const downloadLink = `${process.env.NEXT_PUBLIC_APP_URL}/checkout/sukces?session=${sessionId}`

        if (!email) {
            return { success: false, error: "No email found in session" }
        }

        const { error: resendError } = await resend.emails.send({
            from: 'ProdByOsin <noreply@prodbyosin.pl>', // Or verified domain
            to: email,
            subject: `Twój Beat Czeka! - ${beatTitle}`,
            html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h1>Dziękujemy za zakup!</h1>
                <p>Cześć,</p>
                <p>Twoje zamówienie na beat <strong>${beatTitle}</strong> (${licenseType}) zostało zrealizowane.</p>
                <p>Pobierz swoje pliki tutaj:</p>
                <a href="${downloadLink}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; display: inline-block; border-radius: 4px; margin: 20px 0;">Pobierz Pliki</a>
                <p>lub skopiuj ten link: ${downloadLink}</p>
                <hr />
                <p>W razie pytań odpowiedz na tego maila.</p>
                <p>Pozdrawiamy,<br>ProdByOsin</p>
            </div>
        `
        })

        if (resendError) {
            console.error("Resend Error:", resendError)
            return { success: false, error: "Failed to send email via Resend" }
        }

        return { success: true }

    } catch (error) {
        console.error("Error sending order email:", error)
        return { success: false, error: "Internal server error" }
    }
}
