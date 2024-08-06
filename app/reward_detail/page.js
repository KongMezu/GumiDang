'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import styles from './reward_detail.module.css';

const DaumPostcode = dynamic(() => import('react-daum-postcode'), { ssr: false });

const RewardDetail = () => {
    const router = useRouter();
    const [address, setAddress] = useState('');
    const [detailAddress, setDetailAddress] = useState('');
    const [postcode, setPostcode] = useState('');
    const [showPostcode, setShowPostcode] = useState(false);
    const postcodeRef = useRef(null);

    useEffect(() => {
        if (showPostcode && postcodeRef.current) {
            postcodeRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [showPostcode]);

    const handleBackClick = () => {
        router.push('/reward');
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log({
            address,
            detailAddress,
            postcode,
        });
        alert('배송 정보가 입력되었습니다.');
        router.push('/reward_thank');
    };

    const handleComplete = (data) => {
        setAddress(data.address);
        setPostcode(data.zonecode);
        setShowPostcode(false);
    };

    return (
        <div className={styles.container}>
            <button className={styles.backButton} onClick={handleBackClick}>←</button>
            <h1 className={styles.title}>리워드 배송 정보</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>성함</label>
                    <input type="text" className={styles.input} required />
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>연락처</label>
                    <input type="text" className={styles.input} required />
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>우편번호</label>
                    <input 
                        type="text" 
                        className={styles.input} 
                        value={postcode} 
                        readOnly
                        onClick={() => setShowPostcode(true)}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>주소</label>
                    <input 
                        type="text" 
                        className={styles.input} 
                        value={address}
                        readOnly
                        onClick={() => setShowPostcode(true)}
                    />
                </div>
                {showPostcode && (
                    <div ref={postcodeRef} className={styles.postcodeWrapper}>
                        <DaumPostcode onComplete={handleComplete} />
                    </div>
                )}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>상세주소</label>
                    <input 
                        type="text" 
                        className={styles.input} 
                        value={detailAddress}
                        onChange={(e) => setDetailAddress(e.target.value)}
                    />
                </div>
                <button type="submit" className={styles.submitButton}>배송 신청</button>
            </form>
        </div>
    );
};

export default RewardDetail;
