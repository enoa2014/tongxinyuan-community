import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // TODO: Integrate with real Auth (NextAuth/Clerk)
    // For now, if user visits /dashboard, we redirect them to /login
    // because we can't guess their role without a session.

    if (request.nextUrl.pathname === '/dashboard') {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Basic protection mock
    // if (request.nextUrl.pathname.startsWith('/dashboard')) {
    //   const token = request.cookies.get('token')
    //   if (!token) {
    //     return NextResponse.redirect(new URL('/login', request.url))
    //   }
    // }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/dashboard/:path*',
    ],
}
