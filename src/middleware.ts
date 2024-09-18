import { NextRequest, NextResponse } from 'next/server'
export { default } from "next-auth/middleware"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;

    // Redirect authenticated users away from auth pages
    if (token && 
        (
            url.pathname === '/sign-in' ||
            url.pathname === '/sign-up' ||
            url.pathname === '/verify'
        )
    ) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Redirect unauthenticated users away from protected pages
    if (!token && 
        !(
            url.pathname === '/sign-in' ||
            url.pathname === '/sign-up' ||
            url.pathname === '/verify'
        )
    ) {
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
    '/dashboard/:path*',
  ]
}
