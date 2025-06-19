import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    /*
     * This matches all routes except:
     * - static files (e.g. .png, .css)
     * - _next/
     * - api/auth (Clerk built-in)
     */
    '/((?!.*\\..*|_next|api/auth|favicon.ico).*)',
  ],
};
