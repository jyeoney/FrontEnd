import { NextRequest } from 'next/server';
import { IGNORED_PATHS } from './pathConstants';

const checkPath = (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  if (IGNORED_PATHS.includes(pathname)) {
    console.log('미들웨어 건너뛰기: ', pathname);
    return true;
  }
  return false;
};

export { checkPath };
