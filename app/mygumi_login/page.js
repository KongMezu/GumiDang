'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './mygumi_login.module.css';

const MyGumiLogin = () => {
    const router = useRouter();
    const [showDetail, setShowDetail] = useState(false);

    const handleBackClick = () => {
        router.push('/work_date');
    };

    const handleMenuClick = () => {
        // 메뉴 클릭 시 동작 추가 예정
    };

    const handleAddClick = () => {
        router.push('/work_date');
    };

    const handleGumiClick = () => {
        setShowDetail(true);
    };

    const handleDetailCloseClick = () => {
        setShowDetail(false);
    };

    const handleDetailEditClick = () => {
        setShowDetail(false);
    };

    return (
        <div className={styles.container}>
            <button className={styles.backButton} onClick={handleBackClick}>←</button>
            <h1 className={styles.title}>나의 구미</h1>
            <button className={styles.menuButton} onClick={handleMenuClick}>≡</button>
            <div className={styles.gumiBox}>
                <div className={styles.gumiGrid}>
                    <div className={styles.gumi} onClick={handleGumiClick}></div>
                    <div className={styles.gumi} onClick={handleGumiClick}></div>
                    {/* 나머지 구미는 백엔드에서 동적으로 추가 */}
                </div>
                <div className={styles.rollupJelly}>롤업젤리_합계</div>
                <button className={styles.addButton} onClick={handleAddClick}>+</button>
            </div>

            {showDetail && (
                <div className={styles.detailOverlay}>
                    <div className={styles.detailBox}>
                        <div className={styles.detailHeader}>
                            <span className={styles.detailDate}>20xx.n,m</span>
                            <button className={styles.editButton} onClick={handleDetailEditClick}>수정</button>
                            <button className={styles.deleteButton} onClick={handleDetailCloseClick}>삭제</button>
                        </div>
                        <p className={styles.detailText}>
                            &#39;시작지&#39; 에서부터 &#39;도착지&#39; 까지의 산책을 하다<br />
                            거리 표시: n km
                        </p>
                        <div className={styles.detailImage}>(사진)</div>
                        <div className={styles.detailRollupJelly}>롤업젤리_개별</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyGumiLogin;
