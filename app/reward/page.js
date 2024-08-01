/*
리워드 페이지
해야할거:
1) 저 리워드 받은 횟수는 어디서 가져와야할까.. 백이 맞을거 같은데 무슨 값에서 ..가져와야
*/
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa'; 
import styles from './reward.module.css';

const Reward = () => {
    const router = useRouter();

    const handleBackClick = () => {
        router.push('/mygumi_login');
    };

    const handleRewardDetailClick = () => {
        router.push('/reward_detail');
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
                <div className={styles.rewardNumber}>1</div>
                <p className={styles.rewardText}>번째 리워드 달성을 성공했어요!</p>
                <div className={styles.rollupJelly}>롤업젤리_합계</div>
                <button className={styles.rewardButton} onClick={handleRewardDetailClick}>
                    📦 리워드 배송 정보 입력
                </button>
            </div>
        </div>
    );
};

export default Reward;
