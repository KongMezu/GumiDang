'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './mygumi_logout.module.css';

const MyGumiLogout = () => {
const router = useRouter();

const handleBackClick = () => {
    router.push('/');
};

const handleCollectGumiClick = () => {
    router.push('/work_date');
};

return (
    <div className={styles.container}>
    <button className={styles.backButton} onClick={handleBackClick}>←</button>
    <h1 className={styles.title}>나의 구미</h1>
    <div className={styles.gumiBox}>
        <p className={styles.gumiText}>구미가 없어요.<br />구미를 모아보세요!</p>
    </div>
    <button className={styles.collectButton} onClick={handleCollectGumiClick}>구미 모으러 가기</button>
    </div>
);
};

export default MyGumiLogout;
