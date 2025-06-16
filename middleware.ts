import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Các route được xem là public (không cần đăng nhập)
const isPublicRoute = createRouteMatcher([
  '/',
  '/properties(.*)',
  '/checkout',
  '/bookings(.*)',
]);

// Route dành cho admin (cần check userId)
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const authData = auth();

  // Bảo vệ route admin (chỉ admin mới truy cập)
  if (isAdminRoute(req)) {
    const userId = authData.userId;
    const isAdminUser = userId === process.env.ADMIN_USER_ID;

    if (!isAdminUser) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Bảo vệ tất cả route không thuộc public
  if (!isPublicRoute(req) && !isAdminRoute(req)) {
    authData.protect();
  }
});

export const config = {
  matcher: [
    '/',                          // trang chủ
    '/((?!.*\\..*|_next).*)',     // tất cả route khác trừ file tĩnh
    '/admin(.*)',                 // admin được bảo vệ riêng
    // ❌ KHÔNG gồm '/api/(.*)' để tránh lỗi build
  ],
};
