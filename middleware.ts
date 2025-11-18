import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const { pathname } = request.nextUrl

  // Public paths that don't require authentication
  const publicPaths = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/categories",
    "/search",
    "/professionals",
  ]

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path))
  const isAuthPath = pathname.startsWith("/api/auth")

  // Allow public paths and auth endpoints
  if (isPublicPath || isAuthPath) {
    return NextResponse.next()
  }

  // Redirect to login if not authenticated
  if (!token) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  // Role-based access control
  const isCustomerPath = pathname.startsWith("/customer")
  const isProfessionalPath = pathname.startsWith("/professional")
  const isAdminPath = pathname.startsWith("/admin")

  if (isCustomerPath && token.role !== "CUSTOMER") {
    return NextResponse.redirect(new URL("/unauthorized", request.url))
  }

  if (isProfessionalPath && token.role !== "PROFESSIONAL") {
    return NextResponse.redirect(new URL("/unauthorized", request.url))
  }

  if (isAdminPath && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
