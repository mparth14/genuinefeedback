import { NextRequest, NextResponse } from 'next/server'
export { default } from "next-auth/middleware"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;

    const isAuthRoute = ['/sign-in', '/sign-up', '/verify'].some((path) =>
        url.pathname.startsWith(path)
    );

    // Redirect authenticated users away from auth pages
    if (token && isAuthRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Redirect unauthenticated users away from protected pages, excluding `/verify`
    const isProtectedRoute = ['/dashboard'].some((path) =>
        url.pathname.startsWith(path)
    );

    if (!token && isProtectedRoute) {
        return NextResponse.redirect(new URL('/sign-up', request.url));
    }

    return NextResponse.next();
}


export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/verify/:path*',
  ]
}
