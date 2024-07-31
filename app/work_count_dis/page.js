'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import styles from './count_dis.module.css';

const CountDisPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [distance, setDistance] = useState(null);
    const router = useRouter();

    const handleMeasureDistance = async () => {
        setIsLoading(true);
        try {
            // 여기서 API 호출을 통해 거리 계산 요청을 보내는 예시입니다.
            const response = await fetch('실제api 엔드 포인트');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            setDistance(result.distance); // 결과부터 거리 설정
        } catch (error) {
            console.error('Error fetching distance:', error);
        } finally {
            setIsLoading(false); // 로딩 상태 종료
            router.push('/work_save'); // 로딩 종료 후 work_save 페이지로 이동
        }
    };

    const handleBack = () => {
        router.push('/');
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <FaArrowLeft className={styles.backArrow} onClick={handleBack} />
            </div>
            <div className={styles.content}>
                <h1 className={styles.title}>거리를 측정 중이에요 🍬</h1>
                <div className={styles.loaderContainer}>
                    {isLoading ? (
                        <div className={styles.loader}>롤업젤리 이미지 예정</div>
                    ) : (
                        <div className={styles.placeholder}>롤업젤리</div>
                    )}
                </div>
                <button onClick={handleMeasureDistance} className={styles.measureButton}>
                    롤업젤리를 굴리며 재고 있어요.
                </button>
                {distance !== null && !isLoading && (
                    <div className={styles.result}>
                        측정된 거리: {distance} 미터
                    </div>
                )}
            </div>
        </div>
    );
};

export default CountDisPage;
