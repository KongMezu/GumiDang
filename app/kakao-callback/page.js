'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const KakaoCallback = () => {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');

    if (accessToken) {
      localStorage.setItem('Authorization', `Bearer ${accessToken}`);
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return <p>Processing Kakao login...</p>;
};

export default KakaoCallback;
