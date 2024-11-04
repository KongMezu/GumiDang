'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import axios from 'axios';
import styles from './reward_detail.module.css';

const DaumPostcode = dynamic(() => import('react-daum-postcode'), { ssr: false });

const RewardDetail = () => {
    const router = useRouter();
    const [address, setAddress] = useState('');
    const [detailAddress, setDetailAddress] = useState('');
    const [postcode, setPostcode] = useState('');
    const [nickname, setNickname] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [showPostcode, setShowPostcode] = useState(false);
    const postcodeRef = useRef(null);
    const [rewardStatus, setRewardStatus] = useState('');

    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem('AccessToken');
            try {
                const response = await axios.get('https://gummy-dang-server.com/api/member', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.data.code === 'COM-000') {
                    setNickname(response.data.data.nickname || '');
                    setPhoneNumber(response.data.data.phoneNumber || '');
                    setAddress(response.data.data.address || '');
                }
            } catch (error) {
                console.error('Failed to fetch user info:', error);
            }
        };
        const fetchRewardInfo = async () => {
            const token = localStorage.getItem('AccessToken');
            try {
                const response = await axios.get('https://gummy-dang-server.com/api/reward', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.data.code === 'COM-000') {
                    setRewardStatus(response.data.data.rewardStatus);
                }
            } catch (error) {
                console.error('Failed to fetch reward info:', error);
            }
        };

        fetchUserInfo();
        fetchRewardInfo();

        if (showPostcode && postcodeRef.current) {
            postcodeRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [showPostcode]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('AccessToken');
        const fullAddress = `${address}, ${detailAddress}`;

        try {
            // 배송지 정보 제출
            const response = await axios.put('https://gummy-dang-server.com/api/member', {
                nickname: nickname,
                address: fullAddress,
                phoneNumber: phoneNumber
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.code === 'COM-000') {
                console.log('Delivery info submitted successfully.');
                await completeReward(token);
                router.push('/reward_thank');
            } else {
                console.error('Failed to submit delivery info:', response.data);
            }
        } catch (error) {
            console.error('Failed to submit delivery info:', error);
        }
    };

    const completeReward = async (token) => {
        try {
            const response = await axios.post('https://gummy-dang-server.com/api/reward/done', {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.code === 'COM-000') {
                console.log('Reward status updated to DONE.');
            } else {
                console.error('Failed to update reward status:', response.data);
            }
        } catch (error) {
            console.error('Error completing reward:', error);
        }
    };

    const handleComplete = (data) => {
        setAddress(data.address);
        setPostcode(data.zonecode);
        setShowPostcode(false);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>리워드 배송 정보</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>성함</label>
                    <input 
                        type="text" 
                        className={styles.input} 
                        value={nickname} 
                        onChange={(e) => setNickname(e.target.value)} 
                        required 
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>연락처</label>
                    <input 
                        type="text" 
                        className={styles.input} 
                        value={phoneNumber} 
                        onChange={(e) => setPhoneNumber(e.target.value)} 
                        required 
                    />
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
