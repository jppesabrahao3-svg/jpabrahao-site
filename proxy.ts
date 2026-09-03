import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { INTERNO_AUTH_COOKIE, isValidInternoAuthCookie } from "./app/lib/internoAuth"

// Protege qualquer rota /interno/*. A pagina de login fica de fora pra nao
// criar loop de redirecionamento.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === "/interno/login") {
    return NextResponse.next()
  }

  const cookie = request.cookies.get(INTERNO_AUTH_COOKIE)?.value
  if (!isValidInternoAuthCookie(cookie)) {
    const loginUrl = new URL("/interno/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/interno/:path*"],
}
