/* 뭘까 이건 */
/*로그인 상태 확인 및 로그인 상태에서 로그인 페이지 접속 시 나의 산책 페이지 리다이렉트 */

import { NextResponse } from 'next/server';

export function middleware(req) {
  const token = req.cookies['AccessToken'];

  // 로그인 페이지에 접근하는 경우
  if (req.nextUrl.pathname.startsWith('/login')) {
    if (token) {
      // 토큰이 있는 경우 로그인된 상태로 간주하고 리디렉션
      return NextResponse.redirect(new URL('/mygumi_login', req.url));
    }
  } else {
    // 로그인 페이지 외의 페이지 접근 시 로그인 여부 확인
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|static|favicon.ico).*)'],
};
