'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import styles from './work_input.module.css';

const HomePage = () => {
const router = useRouter();
const searchParams = useSearchParams();
const [startLocation, setStartLocation] = useState('');
const [endLocation, setEndLocation] = useState('');

useEffect(() => {
    const startLocationFromQuery = searchParams.get('startLocation');
    if (startLocationFromQuery) {
    setStartLocation(startLocationFromQuery);
    }
    const endLocationFromQuery = searchParams.get('endLocation');
    if (endLocationFromQuery) {
    setEndLocation(endLocationFromQuery);
    }
}, [searchParams]);

const handleStartClick = () => {
    router.push('/work_start');
};

const handleEndClick = () => {
    router.push('/work_arrive');
};

const handleMeasureClick = async () => {
    if (startLocation && endLocation) {
    try {
        const response = await fetch('https://gummy-dang.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ start: startLocation, end: endLocation }),
        });

        if (!response.ok) {
        throw new Error('네트워크 응답이 올바르지 않습니다.');
        }

        const result = await response.json();
        router.push('/work_input'); // work_input 페이지로 이동
    } catch (error) {
        console.error('거리 측정 중 문제가 발생했습니다:', error);
        alert('거리 측정 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
    } else {
    alert('시작 위치와 도착 위치를 모두 선택해 주세요.');
    }
};

return (
    <div className={styles.container}>
    <h1 className={styles.title}>산책기록 입력하기</h1>
    <div className={styles.section} style={{ '--section-margin-top': 'calc(100px - 50px + 5vh)' }}>
        <div className={`${styles.labelWrapper} ${styles.start}`}>
        <span className={styles.iconWrapper}>
            <FaMapMarkerAlt />
        </span>
        <span className={styles.label}>시작</span>
        </div>
        <div className={styles.searchBox} onClick={handleStartClick}>
        <span className={styles.searchInput}>{startLocation || '시작한 곳을 검색하세요'}</span>
        <span className={styles.searchIcon}>
            <FaSearch />
        </span>
        </div>
    </div>
    <div className={styles.section} style={{ '--section-margin-top': 'calc(30px - 10px + 5vh)' }}>
        <div className={`${styles.labelWrapper} ${styles.end}`}>
        <span className={styles.label}>도착</span>
        <span className={`${styles.iconWrapper} ${styles.end}`}>
            <FaMapMarkerAlt />
        </span>
        </div>
        <div className={styles.searchBox} onClick={handleEndClick}>
        <span className={styles.searchInput}>{endLocation || '도착한 곳을 검색하세요'}</span>
        <span className={styles.searchIcon}>
            <FaSearch />
        </span>
        </div>
    </div>
    <button
        className={styles.button}
        onClick={handleMeasureClick}
        disabled={!startLocation || !endLocation}
    >
        거리 측정하기
    </button>
    </div>
);
};

export default HomePage;
