'use client';

import apiClient from '../utils/apiClient';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styled, { createGlobalStyle } from 'styled-components';


export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
  const [nickname, setNickname] = useState(""); // 유저 닉네임 상태

  const router = useRouter(); // useRouter 훅을 사용하여 라우터 객체 가져오기

  const handleLogout = async () => {
    // 클라이언트 측에서 인증 정보를 제거합니다.
    localStorage.removeItem('AccessToken');
    localStorage.removeItem('Nickname');

    // 서버 측 로그아웃 요청
    try {
      await apiClient.post('/api/logout'); // apiClient를 사용하여 로그아웃 요청
      setIsLoggedIn(false);
      setNickname(""); 
      setIsOpen(false);// 로그아웃 시 닉네임도 초기화
      router.push('/'); 
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    // 페이지 로드 시 로컬 스토리지에서 로그인 상태를 확인합니다.
    const token = localStorage.getItem('AccessToken');
    const savedNickname = localStorage.getItem('nickname');
    
    if (token && savedNickname) {
      setIsLoggedIn(true);
      setNickname(savedNickname);
    } else {
      setIsLoggedIn(false);
      setNickname(""); // 토큰이 없으면 닉네임도 초기화
    }
  }, []);

  return (
    <>
      <GlobalStyle />
      <BackButton onClick={() => router.back()} />
      <MenuButton isOpen={isOpen} onClick={() => setIsOpen(true)}>&#9776;</MenuButton>
      <Sidebar isOpen={isOpen}>
        <CloseButton onClick={() => setIsOpen(false)}>&times;</CloseButton>
        <UserSection>
          {isLoggedIn ? (
            <p>
              <UserLink href="/k">{nickname}님</UserLink>
              <WelcomeMessage>오늘도 가볍게 걸어볼까요?</WelcomeMessage>
            </p>
          ) : (
            <p>
              <UserLink href="/login">로그인 하세요 &gt;</UserLink>
            </p>
          )}
        </UserSection>
        <LinksSection>
          <a href="/">마이페이지</a>
          <a href="/work_date">산책하기</a>
          <a href="/posts">산책 구경</a>
          <a href={isLoggedIn ? "/mygumi_login" : "/mygumi_logout"}>나의 산책</a>
          {isLoggedIn && (
            <a href="#" onClick={handleLogout}>로그아웃</a>
          )}
        </LinksSection>
        <BottomLinksSection>
          <a href="/도움 및 의견보내기">도움 및 의견 보내기</a>
          <a href="/about">ABOUT</a>
        </BottomLinksSection>
      </Sidebar>
    </>
  );
}

// 글로벌 스타일로 폰트 적용
const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Pretendard-Regular';
    src: url('https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
  }

  body {
    font-family: 'Pretendard-Regular', sans-serif;
  }
`;

// 햄버거 메뉴 버튼 스타일
const MenuButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: #333;
  display: ${props => (props.isOpen ? 'none' : 'block')};
`;

// 사이드바 스타일
const Sidebar = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: ${props => (props.isOpen ? '326px' : '0')};
  height: 100%;
  background-color: #C3FFC1;
  overflow-x: hidden;
  transition: 0.5s;
  padding-top: 60px;
  z-index: 999;
  color: #333;
  font-size: 20px;
  font-weight: 400;
`;

// 닫기 버튼 스타일
const CloseButton = styled.a`
  position: absolute;
  top: 20px;
  right: 25px;
  font-size: 36px;
  color: #333;
  cursor: pointer;
`;

// 사용자 영역 스타일
const UserSection = styled.div`
  padding: 20px;
  font-size: 12px;
  font-weight: 400;
`;

// 링크 영역 스타일
const LinksSection = styled.div`
  padding: 20px;
  position: relative;

  a {
    display: block;
    padding: 10px 0;
    color: #333;
    text-decoration: none;
    transition: 0.3s;
    font-size: 20px;
    font-weight: 400;

    &:hover {
      color: #000;
    }
  }
`;

// 하단 링크 영역 스타일
const BottomLinksSection = styled.div`
  position: absolute;
  width: 100%;
  padding: 20px;
  border-top: 1px solid #B3B3B3;
  font-size: 20px;
  font-weight: 400;

  a {
    display: block;
    padding: 10px 0;
    color: #B3B3B3;
    text-decoration: none;
    transition: 0.3s;

    &:hover {
      color: #000;
    }
  }
`;

// 사용자 링크 스타일
const UserLink = styled.a`
  color: #333;
  text-decoration: none;
  cursor: pointer;
  font-size: 24px;
  font-weight: bold;

  &:hover {
    color: #000;
  }
`;

// 오늘도 가볍게 걸어볼까요? 텍스트 스타일
const WelcomeMessage = styled.p`
  font-size: 18px;
  font-weight: bold;
`;

// 뒤로가기 버튼 스타일
const BackButton = styled.button`
  position: fixed;
  top: 20px;
  left: 20px;
  background: url('/image/back_signal.PNG') no-repeat center center;
  background-size: cover;
  width: 20px;
  height: 20px;
  border: none;
  cursor: pointer;
  z-index: 1000;
`;
