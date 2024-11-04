'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './reward.module.css';

const Reward = () => {
    const router = useRouter();
    const [rewardStatus, setRewardStatus] = useState(null);
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        fetchRewardStatus();
    }, []);

    const fetchRewardStatus = async () => {
        try {
            const token = localStorage.getItem('AccessToken');
            const response = await axios.get('https://gummy-dang-server.com/api/reward', { 
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.data.code === 'COM-000') {
                setRewardStatus(response.data.data.rewardStatus);
                setPercentage(response.data.data.percentage);
            }
        } catch (error) {
            console.error('Failed to fetch reward status:', error);
        }
    };

    const handleRewardDetailClick = () => {
        localStorage.setItem('rewardReset', 'true');
        router.push('/reward_detail'); 
    };
    
    const handleClearRewardsClick = () => {
        localStorage.setItem('rewardReset', 'true');
        router.push('/mygumi_login'); 
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>리워드</h1>
            </div>
            <div className={styles.content}>
                <div className={styles.emoji}>🎁</div>
                <p className={styles.congratsText}>축하해요!<br />배송정보를 입력하고 젤리를 받으세요!</p>
                <p className={styles.rewardText}>리워드 달성을 성공했어요!</p>
                <p className={styles.rewardText}>리워드 달성율: {percentage}%</p>
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
