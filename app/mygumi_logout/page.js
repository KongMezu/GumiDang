'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa'; 
import styles from './mygumi_logout.module.css';

const MyGumiLogout = () => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [hasGumi, setHasGumi] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('AccessToken');
        if (token) {
            setIsLoggedIn(true);
            fetchGumiData(token);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const fetchGumiData = async (token) => {
        try {
            const response = await fetch('https://gummy-dang.com/api/records', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            setHasGumi(data.data.walkRecordInfos.length > 0);
        } catch (error) {
            console.error('Error fetching gumi data:', error);
        }
    };

    const handleBackClick = () => {
        router.push('/');
    };

    const handleCollectGumiClick = () => {
        if (!isLoggedIn) {
            router.push('/login');
        } else if (!hasGumi) {
            router.push('/work_date');
        }
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
