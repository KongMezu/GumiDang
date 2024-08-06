'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa'; 
import styles from './reward.module.css';

const Reward = () => {
    const router = useRouter();
    const [rewardStatus, setRewardStatus] = useState(null);

    useEffect(() => {
        fetchRewardStatus();
    }, []);

    const fetchRewardStatus = async () => {
        try {
            const response = await fetch('/api/reward');
            const data = await response.json();
            if (data.code === 'COM-000') {
                setRewardStatus(data.data.rewardStatus);
            }
        } catch (error) {
            console.error('Failed to fetch reward status:', error);
        }
    };

    const handleBackClick = () => {
        router.push('/mygumi_login');
    };

    const handleRewardDetailClick = () => {
        router.push('/reward_detail');
    };

    const handleClearRewardsClick = async () => {
        try {
            const response = await fetch('/api/reward/clear', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (data.code === 'COM-000') {
                alert('리워드가 초기화되었습니다.');
                router.push('/mygumi_login');
            } else {
                console.error('Failed to clear rewards:', data);
            }
        } catch (error) {
            console.error('Failed to clear rewards:', error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <FaArrowLeft className={styles.backArrow} onClick={handleBackClick} />
                <h1 className={styles.title}>리워드</h1>
            </div>
            <div className={styles.content}>
                <div className={styles.emoji}>🎁</div>
                <p className={styles.congratsText}>축하해요!<br />배송정보를 입력하고 젤리를 받으세요!</p>
                <p className={styles.rewardText}>리워드 달성을 성공했어요!</p>
                <div className={styles.rollupJelly}>롤업젤리_합계</div>
                <button className={styles.rewardButton} onClick={handleRewardDetailClick}>
                    📦 리워드 배송 정보 입력
                </button>
                <button className={styles.clearRewardButton} onClick={handleClearRewardsClick}>
                    리워드 괜찮아요
                </button>
            </div>
        </div>
    );
};

export default Reward;
