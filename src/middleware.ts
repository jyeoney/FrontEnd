import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import checkAuth from './app/middlewares/auth';

export function middleware(request: NextRequest) {
  const authResponse = checkAuth(request);
  if (authResponse) {
    return authResponse;
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
