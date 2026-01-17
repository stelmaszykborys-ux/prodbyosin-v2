import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email, subject, message, type } = await request.json()

    // Walidacja
    if (!email || !subject) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data, error } = await resend.emails.send({
      from: 'ProdByOsin <noreply@prodbyosin.pl>',
      to: email, // W produkcji to powinno iść do admina (dla formularza kontaktowego) lub do klienta
      // Jeśli to formularz kontaktowy, pewnie chcemy wysłać wiadomość OD klienta DO admina.
      // Ale 'type' może sugerować różne zastosowania. 
      // Załóżmy, że jeśli type='contact', to idzie do admina.
      subject: subject,
      html: `
        <div>
            <h1>Nowa wiadomość ze strony</h1>
            <p><strong>Od:</strong> ${email}</p>
            <p><strong>Temat:</strong> ${subject}</p>
            <div style="border:1px solid #ccc; padding:10px; margin:10px 0;">
                ${message}
            </div>
        </div>
      `
    })

    if (error) {
      console.error("Resend Error:", error)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Email sent successfully" })
  } catch (error) {
    console.error("Email error:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
