'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const OauthLoginPage = () => {
  const router = useRouter();

  useEffect(() => {
    // 클라이언트에서만 실행되도록 window 객체 확인
    if (typeof window !== 'undefined') {
      const { searchParams } = new URL(window.location.href);
      const accessToken = searchParams.get('token');
      const nickname = searchParams.get('nickname');

      if (accessToken) {
        window.localStorage.setItem('AccessToken', accessToken);
        window.localStorage.setItem('nickname', nickname);
        router.push('/mygumi_login');
      } else {
        console.error('Access token not found');
      }
    }
  }, [router]);

  return <div>로딩중..</div>;
};

export default OauthLoginPage;
