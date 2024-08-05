'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '../utils/apiClient';
import ImageButton from '../button/ImageButton';
import styles from './Login.module.css'; // CSS 모듈을 가져옵니다

const Login = () => {
  const [userName, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('AccessToken'); //로컬스토리지에서 엑세스토큰 확인
    if (token) {
      router.push('/mygumi_login');//로그인 되어있으면 나의 산책(나의 구미)로 리다이렉트
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault(); //폼 기본 제출 동작 (새로고침) 방지

    try {
      const response = await apiClient.post('/api/login', { userName, password }); //로그인 요청

      if (response.data.code === 'COM-000') { // 로그인 성공 응답
        const token = response.headers['authorization']; //인증 토큰 처리

        if (token) {
          localStorage.setItem('AccessToken', token.split(' ')[1]); //토큰 추출 : Bearer 접두사 제외 추출
          router.push('/mygumi_login');// 로그인 성공 시 나의 산책(나의구미) 로 리다이렉트
        } else {
          setError('Token not found in response');
        }
      } else {
        setError('등록된 이메일 혹은 비밀번호가 아닙니다.');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  //카카오 로그인버튼 함수
  const handleKakaoLogin = () => {
    window.location.href = 'https://gummy-dang.com/oauth2/authorization/kakao';
  };

  //회원가입 라우팅
  const handleRegisterRedirect = () => {
    router.push('/register');
  };

  //이하 입력창 및 버튼 요소
  return (
    <div className={styles.container}>
      <h1>Gummy<br/>Dang</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="이메일"
            required
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>로그인</button>
        {error && <p>{error}</p>}
      </form>
      <button onClick={handleRegisterRedirect} className={styles.registerButton}>회원가입</button>
      <ImageButton onClick={handleKakaoLogin} />
    </div>
  );
};

export default Login;
