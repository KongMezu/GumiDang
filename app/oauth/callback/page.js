/*카카오 로그인 토큰 추출 페이지 */
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const OauthLoginPage = () => {
  const router = useRouter();
  const { searchParams } = new URL(window.location.href);
  const accessToken = searchParams.get('token');
  // const nickname = searchParams.get('nickname');

  useEffect(() => {
    if (accessToken) {
      window.localStorage.setItem('AccessToken', accessToken);
      // window.localStorage.setItem('nickname', nickname);
      router.push('/mygumi_login');
    } else {
      console.error('Access token not found');
    }
  }, [accessToken, router]);

  return <div>로딩중..</div>;
};

export default OauthLoginPage;
