/*산책기록_로딩페이지
해야할거:
1) 쌈뽕한 CSS 애니메이션
2) 거리계산 로직 -> 완료 되면 work_save로 넘기기
3) 
*/

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import styles from './count_dis.module.css';

const CountDisPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const startLat = parseFloat(searchParams.get('startLat'));
    const startLon = parseFloat(searchParams.get('startLon'));
    const endLat = parseFloat(searchParams.get('endLat'));
    const endLon = parseFloat(searchParams.get('endLon'));
    const recordDate = searchParams.get('recordDate');

    const handleMeasureDistance = () => {
        setIsLoading(true);

        // 거리 계산(왜이러는지는 GPT만 알아!)
        const toRad = (value) => value * Math.PI / 180;
        const R = 6371e3;
        const φ1 = toRad(startLat);
        const φ2 = toRad(endLat);
        const Δφ = toRad(endLat - startLat);
        const Δλ = toRad(endLon - startLon);

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const calculatedDistance = R * c;

        setIsLoading(false);

        const params = new URLSearchParams({
            startLat,
            startLon,
            endLat,
            endLon,
            distance: calculatedDistance,
            recordDate
        });

        router.push(`/work_save?${params.toString()}`);
    };

    useEffect(() => {
        handleMeasureDistance();
    }, []);

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
                        <div className={styles.loader}>롤업젤리 이미지 예정를 돌릴 예정</div>
                    ) : (
                        <div className={styles.placeholder}>롤업젤리</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CountDisPage;
