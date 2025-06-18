import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Các route public (không cần đăng nhập)
const isPublicRoute = createRouteMatcher([
  '/',
  '/properties(.*)',
  '/checkout',
  '/bookings(.*)',
]);

// Route admin (chỉ cho ADMIN_USER_ID)
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // Bỏ qua middleware cho route API
  if (req.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const authData = auth();

  // Bảo vệ route admin
  if (isAdminRoute(req)) {
    const userId = authData.userId;
    const isAdminUser = userId === process.env.ADMIN_USER_ID;

    if (!isAdminUser) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Bảo vệ route không phải public
  if (!isPublicRoute(req) && !isAdminRoute(req)) {
    authData.protect();
  }
});

export const config = {
  matcher: [
    '/',                           // trang chủ
    '/((?!.*\\..*|_next|api).*)',  // tất cả trừ file tĩnh, _next và API
    '/admin(.*)',                  // admin
  ],
};
