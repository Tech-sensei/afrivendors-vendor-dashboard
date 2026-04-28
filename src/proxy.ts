import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = [
  '/',
  '/appointments',
  '/rfs-requests',
  '/services',
  '/wallet',
  '/messages',
  '/notifications',
  '/business-profile',
  '/reviews',
  '/analytics',
  '/settings',
  '/help-support',
  '/kyc-verification',
];

const authRoutes = [
  '/sign-in',
  '/sign-up',
  '/verify-email',
  "/forgot-password",
  "/reset-password",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;

  const isProtected = protectedRoutes.some((route) =>
    route === '/' ? pathname === '/' : pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtected && !accessToken) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/appointments/:path*',
    '/rfs-requests/:path*',
    '/services/:path*',
    '/wallet/:path*',
    '/messages/:path*',
    '/notifications/:path*',
    '/business-profile/:path*',
    '/reviews/:path*',
    '/analytics/:path*',
    '/settings/:path*',
    '/help-support/:path*',
    '/kyc-verification',
    '/sign-in',
    '/sign-up',
    '/sign-up/celebration',
    '/verify-email',
    "/forgot-password",
    "/reset-password",
  ],
};
