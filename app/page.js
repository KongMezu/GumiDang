/*온보딩

해야할거
:
1) Take a walk.Take a gummy! - 폰트 변경
2) CSS 값 px -> rem or vw,vh 중 하나 

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
    router.push('/write');
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
