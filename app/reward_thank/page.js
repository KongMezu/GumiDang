/*리워드 감사합니다 페이지 */
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './reward_thank.module.css';
import Image from 'next/image';
import groupImg from '/public/Group 83.png';

const RewardThank = () => {
    const router = useRouter();

    const handleTouch = () => {
        router.push('/mygumi_login');
    };

    return (
        <div className={styles.container} onClick={handleTouch}>
            <Image src={groupImg} alt="Group image" className={styles.image} />
            <div className={styles.text}>
                Take a walk,<br />Take a gummy!
            </div>
            <div className={styles.subtitle}>
                🎁 젤리를 배달해드릴게요
            </div>
        </div>
    );
};

export default RewardThank;
