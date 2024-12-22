import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import checkAuth from './app/middlewares/checkAuth';

const middleware = async (request: NextRequest) => {
  const authResponse = await checkAuth(request);
  if (authResponse) {
    const requestCookieHeader = request.headers.get('cookie');
    console.log(`Request cookies: ${requestCookieHeader}`);
    return authResponse;
  }
  return NextResponse.next();
};

export const config = {
  matcher: ['/api/:path*'],
};

export default middleware;
