
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // 1. Protect Admin Routes
    if (path.startsWith('/admin')) {
        // Allow public access to login page
        if (path === '/admin/login') {
            return NextResponse.next();
        }

        // Check for PocketBase Auth Cookie
        // The cookie name 'pb_auth' is consistent with what we set in login page
        const authCookie = request.cookies.get('pb_auth');

        if (!authCookie) {
            // Redirect to login if no auth cookie found
            const loginUrl = new URL('/admin/login', request.url);
            // Optional: Add ?next= param to redirect back after login
            loginUrl.searchParams.set('next', path);
            return NextResponse.redirect(loginUrl);
        }

        // Note: Strict validation of the cookie token usually happens on server/API side
        // Here we just do a quick "has cookie" check to redirect unauthenticated users.
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder content (if specific patterns needed)
         */
        '/admin/:path*',
    ],
}
