import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isAdminArea = pathname.startsWith("/admin")
  const isAdminLogin = pathname === "/admin/login"

  // Admin area protection (important: DO NOT redirect the login page to itself)
  if (isAdminArea) {
    if (!user) {
      if (isAdminLogin) {
        // Allow access to the admin login page when not authenticated
        return supabaseResponse
      }

      const url = request.nextUrl.clone()
      url.pathname = "/admin/login"
      url.searchParams.set("redirect", pathname)
      return NextResponse.redirect(url)
    }

    // If logged in, ensure the user is an admin
    const { data: adminData } = await supabase.from("admins").select("id").eq("id", user.id).single()

    if (!adminData) {
      const url = request.nextUrl.clone()
      url.pathname = "/"
      return NextResponse.redirect(url)
    }

    // If already authenticated and visiting /admin/login, go to the dashboard
    if (isAdminLogin) {
      const url = request.nextUrl.clone()
      url.pathname = "/admin"
      url.searchParams.delete("redirect")
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
