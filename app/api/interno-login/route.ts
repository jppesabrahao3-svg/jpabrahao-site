import { NextResponse } from "next/server"
import { getInternoAuthToken, INTERNO_AUTH_COOKIE, INTERNO_AUTH_MAX_AGE } from "../../lib/internoAuth"

export async function POST(request: Request) {
  const formData = await request.formData()
  const senha = String(formData.get("senha") ?? "")

  const senhaEsperada = process.env.INTERNO_PASSWORD
  if (!senhaEsperada || senha !== senhaEsperada) {
    const loginUrl = new URL("/interno/login", request.url)
    loginUrl.searchParams.set("error", "1")
    return NextResponse.redirect(loginUrl, { status: 303 })
  }

  const response = NextResponse.redirect(new URL("/interno/calculadora", request.url), { status: 303 })
  response.cookies.set({
    name: INTERNO_AUTH_COOKIE,
    value: getInternoAuthToken(),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: INTERNO_AUTH_MAX_AGE,
  })
  return response
}
