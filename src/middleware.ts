import { NextRequest, NextResponse } from 'next/server';

const publicPages = ['/auth', '/api/auth'];
const isPublicPage = (pathname: string) =>
  publicPages.some((page) => pathname.startsWith(page));

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Get session from cookie
  const sessionToken = request.cookies.get('better-auth.session_token')?.value;
  const isAuthenticated = !!sessionToken;

  // If trying to access public page and authenticated, redirect to home
  if (isPublicPage(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If trying to access protected page and not authenticated, redirect to auth
  if (!isPublicPage(pathname) && !isAuthenticated && pathname !== '/') {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
