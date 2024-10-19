'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import styles from './count_dis.module.css';

const CountDisPage = () => {
    const router = useRouter();
    const [startLat, setStartLat] = useState(null);
    const [startLon, setStartLon] = useState(null);
    const [endLat, setEndLat] = useState(null);
    const [endLon, setEndLon] = useState(null);
    const [recordDate, setRecordDate] = useState(null);

    // 클라이언트 사이드에서만 실행되는 코드로 수정
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const startLatParam = parseFloat(params.get('startLat'));
            const startLonParam = parseFloat(params.get('startLon'));
            const endLatParam = parseFloat(params.get('endLat'));
            const endLonParam = parseFloat(params.get('endLon'));
            const recordDateParam = params.get('recordDate');

            setStartLat(startLatParam);
            setStartLon(startLonParam);
            setEndLat(endLatParam);
            setEndLon(endLonParam);
            setRecordDate(recordDateParam);
        }
    }, []); // 빈 배열을 사용하여 처음 한 번만 실행되도록

    useEffect(() => {
        if (startLat && startLon && endLat && endLon) {
            const handleMeasureDistance = () => {
                const toRad = (value) => value * Math.PI / 180;
                const R = 6371e3; // 지구 반경 (미터 단위)
                const φ1 = toRad(startLat);
                const φ2 = toRad(endLat);
                const Δφ = toRad(endLat - startLat);
                const Δλ = toRad(endLon - startLon);

                const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                    Math.cos(φ1) * Math.cos(φ2) *
                    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

                const calculatedDistance = R * c;

                const params = new URLSearchParams({
                    startLat: startLat.toString(),
                    startLon: startLon.toString(),
                    endLat: endLat.toString(),
                    endLon: endLon.toString(),
                    distance: calculatedDistance.toString(),
                    recordDate,
                });

                setTimeout(() => {
                    router.push(`/work_save?${params.toString()}`);
                }, 3000);
            };

            handleMeasureDistance();
        }
    }, [startLat, startLon, endLat, endLon, recordDate, router]);

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
                    <div className={styles.loader}></div>
                </div>
                <p className={styles.bouncingText}>롤업젤리를 굴리면서 재고 있어요!</p>
            </div>
        </div>
    );
};

export default CountDisPage;
