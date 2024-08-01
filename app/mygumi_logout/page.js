/*
나의 구미 (로그아웃 or 로그인은 했지만 모은 구미 없는 상태)
해야할거:
1) 로그아웃 상태 : 로그인 페이지로 유도
2) 로그인은 했지만 모은 구미 없는 상태 : 날짜 선택페이지로 이동
*/
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa'; 
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
            <div className={styles.header}>
                <FaArrowLeft className={styles.backArrow} onClick={handleBackClick} />
                <h1 className={styles.title}>나의 구미</h1>
            </div>
            <div className={styles.gumiBox}>
                <p className={styles.gumiText}>구미가 없어요.<br />구미를 모아보세요!</p>
            </div>
            <button className={styles.collectButton} onClick={handleCollectGumiClick}>구미 모으러 가기</button>
        </div>
    );
};

export default MyGumiLogout;
