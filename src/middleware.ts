import { getSessionCookie } from "better-auth/cookies"
import { NextRequest, NextResponse } from "next/server"

const protectedRoutes = ["/assistants"]
const publicRoutes = ["/sign-in"]

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)

  // TODO: check this
  const sessionCookie = getSessionCookie(req)

  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl))
  }

  if (isPublicRoute && sessionCookie) {
    return NextResponse.redirect(new URL("/assistants", req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
}
