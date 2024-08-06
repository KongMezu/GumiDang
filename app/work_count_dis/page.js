'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import styles from './count_dis.module.css';

const CountDisPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const startLat = parseFloat(searchParams.get('startLat'));
    const startLon = parseFloat(searchParams.get('startLon'));
    const endLat = parseFloat(searchParams.get('endLat'));
    const endLon = parseFloat(searchParams.get('endLon'));
    const recordDate = searchParams.get('recordDate');

    useEffect(() => {
        const handleMeasureDistance = () => {
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
