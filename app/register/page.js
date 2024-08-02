"use client";

import { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";
import Congrats from "./congrats"; // Congrats 컴포넌트를 임포트합니다.

const Register = () => {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [nicknameError, setNicknameError] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [touched, setTouched] = useState({
    userName: false,
    password: false,
    nickname: false,
  });

  const validateEmail = (userName) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(userName);
  };

  const validatePassword = (password) => {
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,13}$/;
    return passwordPattern.test(password);
  };

  const validateNickname = (nickname) => {
    return nickname.length >= 2 && nickname.length <= 8;
  };

  useEffect(() => {
    const isEmailValid = validateEmail(userName);
    const isPasswordValid = validatePassword(password);
    const isNicknameValid = validateNickname(nickname);

    setEmailError(
      touched.userName && !isEmailValid ? "메일 형식을 유지해주세요." : null
    );
    setPasswordError(
      touched.password && !isPasswordValid
        ? "영문, 숫자를 조합한 8~13자를 입력해주세요"
        : null
    );
    setNicknameError(
      touched.nickname && !isNicknameValid ? "2~8자의 이름을 사용해주세요." : null
    );

    setIsFormValid(isEmailValid && isPasswordValid && isNicknameValid);
  }, [userName, password, nickname, touched]);

  const handleBlur = (field) => {
    setTouched({
      ...touched,
      [field]: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) return;

    try {
      const response = await apiClient.post("https://gummy-dang.com/api/register", {
        userName,
        password,
        nickname,
      });

      if (response.data.code === "COM-000") {
        setSuccess(true);
      } else if (response.data.code === "EMAIL_DUPLICATE") {
        setError("중복된 이메일입니다.");
      } else {
        setError("Username already taken");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  if (success) {
    return <Congrats />; // 회원가입 성공 시 Congrats 컴포넌트를 렌더링합니다.
  }

  return (
    <div>
      <h1>회원가입</h1>
      <p>
        로그인에 사용할<br />정보를 입력해 주세요.
      </p>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={() => handleBlur("userName")}
            placeholder="이메일"
            required
          />
          {emailError && <p style={{ color: "red" }}>{emailError}</p>}
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => handleBlur("password")}
            placeholder="비밀번호"
            required
          />
          {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
        </div>
        <div>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onBlur={() => handleBlur("nickname")}
            placeholder="닉네임"
            required
          />
          {nicknameError && <p style={{ color: "red" }}>{nicknameError}</p>}
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: isFormValid ? "blue" : "gray",
            color: "white",
          }}
          disabled={!isFormValid}
        >
          가입 완료
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default Register;
