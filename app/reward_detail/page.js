'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DaumPostcode from 'react-daum-postcode';
import styles from './reward_detail.module.css';

const RewardDetail = () => {
    const router = useRouter();
    const [address, setAddress] = useState('');
    const [detailAddress, setDetailAddress] = useState('');
    const [postcode, setPostcode] = useState('');

    const handleBackClick = () => {
        router.push('/reward');
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // 배송 신청 처리 로직
    };

    const handleComplete = (data) => {
        setAddress(data.address);
        setPostcode(data.zonecode);
    };

    return (
        <div className={styles.container}>
            <button className={styles.backButton} onClick={handleBackClick}>←</button>
            <h1 className={styles.title}>리워드 배송 정보</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input type="text" placeholder="성함" className={styles.input} />
                <input type="text" placeholder="연락처" className={styles.input} />
                <div className={styles.inputGroup}>
                    <input 
                        type="text" 
                        placeholder="우편번호" 
                        className={styles.input} 
                        value={postcode} 
                        readOnly
                    />
                    <input 
                        type="text" 
                        placeholder="주소" 
                        className={styles.input} 
                        value={address}
                        readOnly
                    />
                    <DaumPostcode onComplete={handleComplete} />
                </div>
                <input 
                    type="text" 
                    placeholder="상세주소" 
                    className={styles.input} 
                    value={detailAddress}
                    onChange={(e) => setDetailAddress(e.target.value)}
                />
                <button type="submit" className={styles.submitButton}>배송 신청</button>
            </form>
        </div>
    );
};

export default RewardDetail;
