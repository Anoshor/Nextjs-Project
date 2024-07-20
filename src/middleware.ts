import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;

    // If user is authenticated and trying to access auth pages, redirect to dashboard
    if (token && (url.pathname.startsWith('/signIn') || url.pathname.startsWith('/signUp') || url.pathname.startsWith('/verify'))) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If user is not authenticated and trying to access protected routes, redirect to signIn
    if (!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/signIn', request.url));
    }

    // Allow the request to continue if no redirect is needed
    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/signIn',
        '/signUp',
        '/verify/:path*',
        '/dashboard/:path*',
    ]
};
