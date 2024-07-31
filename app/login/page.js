'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '../utils/apiClient';

const Login = () => {
  const [userName, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('Authorization');
    if (token) {
      apiClient.get('/api/verify-token')
        .then(() => {
          router.push('/dashboard');
        })
        .catch(() => {
          localStorage.removeItem('Authorization');
        });
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await apiClient.post('/api/login', { userName, password });

      if (response.data.code === 'COM-000') {
        const token = response.headers.authorization;
        localStorage.setItem('Authorization', token);
        router.push('/dashboard');
      } else {
        setError('Invalid username or password');
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
      <button onClick={handleKakaoLogin}>카카오로 로그인</button>
      <button onClick={handleRegisterRedirect}>회원가입</button>
    </div>
  );
};

export default Login;
