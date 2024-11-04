/* 온보딩 페이지 */
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import './globals.css';
import Head from 'next/head';

const Onboarding = () => {
  const router = useRouter();
  const [color, setColor] = useState('#E8FF66');
  
  const colors = ['#E8FF66', '#FF7AE2', '#99FF66', '#C875FB', '#6D9CF6'];

  useEffect(() => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setColor(randomColor);
  }, [colors]);

  const handleTouch = () => {
    router.push('/posts');
  };

  return (
    <>
    <Head>
        <meta property="og:title" content="GummyDang" />
        <meta property="og:description" content="Take a walk. Take a gummy!" />
        <meta property="og:url" content="https://gummydang-1012152884843.asia-northeast3.run.app" />
      </Head>
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
    </>
  );
};

export default Onboarding;
