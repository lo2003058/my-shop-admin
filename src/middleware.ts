import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import skipRoutes from '@/config/authRoute';

export async function middleware(request: NextRequest): Promise<NextResponse> {
  // 1. Check if current path is in the skip list
  const { pathname } = request.nextUrl;

  // If the current path starts with any of the skip paths, skip auth check
  const shouldSkip = skipRoutes.some((route) => pathname.startsWith(route));
  if (shouldSkip) {
    return NextResponse.next();
  }

  // 2. Attempt to retrieve the JWT token (NextAuth stores it in cookies)
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // 3. If no token, redirect to sign-in page
  if (!token) {
    const signInUrl = new URL('/auth/signin', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // 4. If token exists, allow the request
  return NextResponse.next();
}

// Configure which routes the middleware should match
export const config = {
  matcher: [
    // Protect everything except NextAuth routes and static files
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
