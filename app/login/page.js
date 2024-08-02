'use client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '../utils/apiClient';
import styles from './page.css';
import ImageButton from '../button/ImageButton'; // ImageButton 컴포넌트 추가

const Login = () => {
  const [userName, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  /*useEffect(() => {
    const token = window.localStorage.getItem('AccessToken');
  }, [router]);*/

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await apiClient.post('/api/login', { userName, password });

      if (response.data.code === 'COM-000') {//로그인 성공
        console.log(response.headers.Authorization);
        const token = response.headers.Authorization;
        console.log(token);
        window.localStorage.setItem('AccessToken', token);//통일
        router.push('/mygumi_login');
      } else {//로그인 실패
        setError('등록된 이메일 혹은 비밀번호가 아닙니다.');
      }
    } catch (err) {
      setError('Server error');
    }
  };
  
  const handleKakaoLogin = () => {
    window.location.href = 'https://gummy-dang.com/oauth2/authorization/kakao';
  };

  const handleRegisterRedirect = () => {
    router.push('/register'); // 회원가입 페이지로 이동
  };

  return (
    <div>
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
        <button type="submit">로그인</button>
        {error && <p>{error}</p>}
      </form>
      <button onClick={handleRegisterRedirect}>회원가입</button>
      <ImageButton onClick={handleKakaoLogin} />
    </div>
  );
};

export default Login;
