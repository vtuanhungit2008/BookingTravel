// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/', '/properties(.*)','/checkout',]);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const authData = auth();
  const isAdminUser = authData.userId === process.env.ADMIN_USER_ID;
  console.log(isAdminUser);
  
  if (isAdminRoute(req) && !isAdminUser) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (!isPublicRoute(req)) authData.protect();
});

export const config = {
  matcher: [
    '/', 
    '/((?!.*\\..*|_next).*)', 
    '/api/(.*)', 
    '/admin(.*)'
  ],
};
