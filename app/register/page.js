"use client";

import { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";
import Congrats from "./congrats"; // Congrats 컴포넌트를 임포트합니다.
import styles from "./register.module.css"; // CSS 모듈을 임포트합니다.

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

  //입력 규칙
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

  //회원가입 입력칸 주의 문구 생성
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
      const response = await apiClient.post("https://gummy-dang-server.com/api/sign-up", {//회원가입 정보 전송
        userName,
        password,
        nickname,
      });

      if (response.data.code === "COM-000") {//회원 가입 성공
        setSuccess(true);
      } else if (response.data.code === "MEM-000") {//이메일(userName)중복
        setError("중복된 이메일입니다.");
      } else {
        setError("Username already taken");
      }
    } catch (error) {
      setError("Server error");
    }
  };

  if (success) {
    return <Congrats />; // 회원가입 성공 시 Congrats 컴포넌트를 렌더링합니다.
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>회원가입</h1>
      <p className={styles.subtitle}>
        로그인에 사용할<br />정보를 입력해 주세요.
      </p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputContainer}>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={() => handleBlur("userName")}
            placeholder="이메일"
            className={`${styles.input} ${touched.userName && emailError ? styles.errorBorder : ""}`}
            required
          />
          {emailError && <p className={styles.errorMessage}>{emailError}</p>}
        </div>
        <div className={styles.inputContainer}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => handleBlur("password")}
            placeholder="비밀번호"
            className={`${styles.input} ${touched.password && passwordError ? styles.errorBorder : ""}`}
            required
          />
          {passwordError && <p className={styles.errorMessage}>{passwordError}</p>}
        </div>
        <div className={styles.inputContainer}>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onBlur={() => handleBlur("nickname")}
            placeholder="닉네임"
            className={`${styles.input} ${touched.nickname && nicknameError ? styles.errorBorder : ""}`}
            required
          />
          {nicknameError && <p className={styles.errorMessage}>{nicknameError}</p>}
        </div>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={!isFormValid}
        >
          가입 완료
        </button>
        {error && <p className={styles.errorMessage}>{error}</p>}
      </form>
    </div>
  );
};

export default Register;
