// app/page.js
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

const Onboarding = () => {
  const router = useRouter();
  const [color, setColor] = useState('#E8FF66');
  
  const colors = ['#E8FF66', '#FF7AE2', '#99FF66', '#C875FB', '#6D9CF6'];

  useEffect(() => {
    // 랜덤 색상
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setColor(randomColor);
  }, []);

  const handleTouch = () => {
    // 터치 시 work_date로 이동
    router.push('/work_date');
  };

  return (
    <div className={styles.container} onClick={handleTouch}>
      <div className={styles.textContainer}>
        <h1 style={{ color }} className={styles.logoText}>Gummy Dang</h1>
        <p>Take a walk. Take a gummy!</p>
      </div>
    </div>
  );
};

export default Onboarding;
