import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value

  // If there's no token and the path is not login or signup, redirect to login
  if (!token) {
    if (
      request.nextUrl.pathname !== "/" &&
      request.nextUrl.pathname !== "/signup" &&
      !request.nextUrl.pathname.startsWith("/_next") &&
      !request.nextUrl.pathname.startsWith("/api")
    ) {
      return NextResponse.redirect(new URL("/", request.url))
    }
    return NextResponse.next()
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")
    const { payload } = await jwtVerify(token, secret)
    const role = payload.role as string

    // Role-based access control
    if (request.nextUrl.pathname.startsWith("/admin") && role !== "Admin") {
      return NextResponse.redirect(new URL("/", request.url))
    }

    if (request.nextUrl.pathname.startsWith("/manager") && role !== "Manager" && role !== "Admin") {
      return NextResponse.redirect(new URL("/", request.url))
    }

    if (request.nextUrl.pathname.startsWith("/employee") && !["Employee", "Manager", "Admin"].includes(role)) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    // If token is invalid, clear it and redirect to login
    const response = NextResponse.redirect(new URL("/", request.url))
    response.cookies.delete("token")
    return response
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
