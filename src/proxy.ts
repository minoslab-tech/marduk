import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server"

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const session = await auth()
  const isAuthenticated = !!session

  // Rotas públicas que não requerem autenticação
  const publicRoutes = ["/auth/login", "/auth/register"]
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // Rotas protegidas do dashboard
  const isDashboardRoute = pathname.startsWith("/dashboard")

  // Se está tentando acessar o dashboard sem estar autenticado
  if (isDashboardRoute && !isAuthenticated) {
    const loginUrl = new URL("/auth/login", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Se está autenticado e tentando acessar páginas de login/register
  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
}

// Configuração do matcher - define quais rotas o middleware deve processar
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (API routes do NextAuth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$).*)",
  ],
}
