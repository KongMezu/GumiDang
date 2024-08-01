/*온보딩

터치하면 - 다음 화면 넘어가기(일단 임시로 work_date(산책기록 입력하기 날짜)) 로 감
통통 튕김.
*/

"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

const Onboarding = () => {
  const router = useRouter();
  const [color, setColor] = useState('#E8FF66');
  
  const colors = ['#E8FF66', '#FF7AE2', '#99FF66', '#C875FB', '#6D9CF6'];

  useEffect(() => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setColor(randomColor);
  }, []);

  const handleTouch = () => {
    // 일단 임시로 date 선택으로 이동
    router.push('/work_date');
  };

  return (
    <div className={styles.container} onClick={handleTouch}>
      <div className={styles.textContainer}>
        <h1 style={{ color }} className={styles.logoText}>
          Gummy<br />Dang
        </h1>
      </div>
      <div className={styles.subtitleContainer}>
        <p className={styles.subtitle}>
          Take a walk.<br />Take a gummy!
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
