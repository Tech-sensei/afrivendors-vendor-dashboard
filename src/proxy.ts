import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = [
  '/',
  '/appointments',
  '/custom-requests',
  '/services',
  '/wallet',
  '/payouts',
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
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const hasSession = Boolean(accessToken || refreshToken);

  const isProtected = protectedRoutes.some((route) =>
    route === '/' ? pathname === '/' : pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtected && !hasSession) {
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
    '/custom-requests/:path*',
    '/services/:path*',
    '/wallet/:path*',
    '/payouts/:path*',
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
