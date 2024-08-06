'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import styles from './mygumi_login.module.css';
import { loadKakaoMap } from "../utils/kakao"; // 카카오 맵 로드 함수 불러오기

const MyGumiLogin = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showDetail, setShowDetail] = useState(false);
    const [gumiList, setGumiList] = useState([]);
    const [rewardAvailable, setRewardAvailable] = useState(false);
    const [totalDistance, setTotalDistance] = useState(0);
    const [draggingGumi, setDraggingGumi] = useState(null);
    const [selectedGumi, setSelectedGumi] = useState(null);
    const [isDropping, setIsDropping] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        fetchGumiData();
    }, []);

    useEffect(() => {
        const id = searchParams.get('walkRecordId');
        if (id) {
            fetchGumiDetail(id);
        }
    }, [searchParams]);

    const fetchGumiData = async () => {
        try {
            const token = localStorage.getItem('AccessToken');
            const response = await axios.get('https://gummy-dang.com/api/records', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = response.data;
            const walkRecordInfos = data.data.walkRecordInfos || [];
            const validGumiList = walkRecordInfos.map(record => ({
                ...record,
            }));
            setGumiList(validGumiList);

            console.log("gumi list:", gumiList);
            console.log("valid gumi list:", validGumiList);

            const totalDistance = validGumiList.reduce((acc, record) => acc + (record.distance || 0), 0);
            setTotalDistance(totalDistance);

            //거리계산
            if (totalDistance >= 100000) {
                setRewardAvailable(true);
            } else {
                setRewardAvailable(false);
            }
        } catch (error) {
            console.error('Error fetching gumi data:', error);
            // setGumiList([]);
            setTotalDistance(0);
        }
    };

    const fetchGumiDetail = async (id) => {
        try {
            const token = localStorage.getItem('AccessToken');
            const response = await axios.get(`https://gummy-dang.com/api/record?recordId=${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const recordData = response.data.data;

            const kakao = await loadKakaoMap();
            if (kakao) {
                const geocoder = new kakao.maps.services.Geocoder();

                const getAddressFromCoords = (lat, lon) => {
                    return new Promise((resolve, reject) => {
                        geocoder.coord2Address(lon, lat, (result, status) => {
                            if (status === kakao.maps.services.Status.OK) {
                                resolve(result[0].address.address_name);
                            } else {
                                reject('Failed to fetch address');
                            }
                        });
                    });
                };

                const startLocation = await getAddressFromCoords(recordData.departureLat, recordData.departureLon);
                const endLocation = await getAddressFromCoords(recordData.arrivalLat, recordData.arrivalLon);

                const detailedGumi = {
                    walkRecordId: recordData.walkRecordId,
                    recordDate: recordData.recordTime,
                    distance: Math.round(recordData.distance),
                    startLocation,
                    endLocation,
                    imageUrl: recordData.imageUrl,
                };
                setSelectedGumi(detailedGumi);
                setShowDetail(true);
            }
        } catch (error) {
            console.error('Error fetching gumi detail:', error);
        }
    };

    const handleBackClick = () => {
        router.push('/work_date');
    };

    const handleAddClick = () => {
        const newWalkRecordId = gumiList.length + 1;
        router.push(`/work_date?walkRecordId=${newWalkRecordId}`);
    };

    const handleGumiClick = async (gumi) => {
        try {
            const token = localStorage.getItem('AccessToken');
            const response = await axios.get(`https://gummy-dang.com/api/record?recordId=${gumi.walkRecordId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const recordData = response.data.data;

            const kakao = await loadKakaoMap();
            if (kakao) {
                const geocoder = new kakao.maps.services.Geocoder();

                const getAddressFromCoords = (lat, lon) => {
                    return new Promise((resolve, reject) => {
                        geocoder.coord2Address(lon, lat, (result, status) => {
                            if (status === kakao.maps.services.Status.OK) {
                                resolve(result[0].address.address_name);
                            } else {
                                reject('Failed to fetch address');
                            }
                        });
                    });
                };

                const startLocation = await getAddressFromCoords(recordData.departureLat, recordData.departureLon);
                const endLocation = await getAddressFromCoords(recordData.arrivalLat, recordData.arrivalLon);

                const detailedGumi = {
                    ...gumi,
                    recordDate: recordData.recordTime,
                    distance: Math.round(recordData.distance), // 소수점 제거
                    startLocation,
                    endLocation,
                    imageUrl: recordData.imageUrl,
                };
                setSelectedGumi(detailedGumi);
                setShowDetail(true);
            }
        } catch (error) {
            console.error('Error fetching gumi detail:', error);
        }
    };

    const handleDetailCloseClick = () => {
        setShowDetail(false);
        setSelectedGumi(null);
    };

    const handleDragStart = (gumi) => {
        setDraggingGumi(gumi);
        setIsDropping(true);
    };

    const handleDragEnd = () => {
        setDraggingGumi(null);
        setIsDropping(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (draggingGumi) {
            deleteGumi(draggingGumi.walkRecordId);
            setDraggingGumi(null);
            setIsDropping(false);
        }
    };

    const deleteGumi = async (id) => {
        try {
            const token = localStorage.getItem('AccessToken');
            const response = await axios.delete(`https://gummy-dang.com/api/record?recordId=${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const updatedGumiList = gumiList.filter(gumi => gumi.walkRecordId !== id);
            setGumiList(updatedGumiList);

            // 업데이트된 총 거리 재계산
            const newTotalDistance = updatedGumiList.reduce((acc, gumi) => acc + (gumi.distance || 0), 0);
            setTotalDistance(newTotalDistance);

            // 보상 조건 재확인
            if (newTotalDistance >= 100000) {
                setRewardAvailable(true);
            } else {
                setRewardAvailable(false);
            }

            setShowDetail(false);
            setSelectedGumi(null);
        } catch (error) {
            console.error('Error deleting gumi:', error);
        }
    };

    const handleRewardClick = () => {
        router.push('/reward');
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file && selectedGumi) {
            const formData = new FormData();
            formData.append('image', file);

            try {
                const token = localStorage.getItem('AccessToken');
                const response = await axios.post(`https://gummy-dang.com/api/records/${selectedGumi.walkRecordId}/upload`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = response.data;
                console.log('Image upload response:', data);
                setSelectedGumi(prev => ({ ...prev, imageUrl: data.imageUrl }));
                const updatedGumiList = gumiList.map(gumi =>
                    gumi.walkRecordId === selectedGumi.walkRecordId ? { ...gumi, imageUrl: data.imageUrl } : gumi
                );
                setGumiList(updatedGumiList);
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    };

    const getJellyImage = (distance) => {
        if (distance === 0) return '/0.png';
        if (distance >= 10000) return '/11.png';
        return `/${Math.min(Math.floor(distance / 1000), 10) + 1}.png`;
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <FaArrowLeft className={styles.backArrow} onClick={handleBackClick} />
                <h1 className={styles.title}>나의 구미</h1>
            </div>
            <div className={styles.content}>
                <div className={styles.gumiBox}>
                    <div className={styles.gumiGrid}>
                        {gumiList.length > 0 && gumiList.map((gumi) => {
                            console.log("render", gumi.gummyUrl);
                            <div
                                key={gumi.walkRecordId}
                                className={`${styles.gumi} ${draggingGumi === gumi ? styles.draggingGumi : ''}`}
                                style={{ backgroundImage: `url('${gumi.gummyUrl}')` }}
                                onClick={() => handleGumiClick(gumi)}
                                draggable
                                onDragStart={() => handleDragStart(gumi)}
                                onDragEnd={handleDragEnd}
                            ></div>
                        })}
                    </div>
                    <div className={styles.rollupJelly}>
                        총 거리: {totalDistance} m
                        {rewardAvailable && (
                            <div className={styles.rewardContainer}>
                                <button className={styles.rewardButton} onClick={handleRewardClick}>
                                    보상 수령하기
                                </button>
                                {showConfetti && <div className={styles.confetti}></div>}
                            </div>
                        )}
                    </div>
                    <button
                        className={`${styles.addButton} ${isDropping ? styles.dropping : ''}`}
                        onClick={handleAddClick}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                    >
                        {isDropping ? '✕' : '+'}
                    </button>
                </div>

                {showDetail && selectedGumi && (
                    <div className={styles.detailOverlay} onClick={handleDetailCloseClick}>
                        <div className={styles.detailBox} onClick={(e) => e.stopPropagation()}>
                            <div className={styles.detailHeader}>
                                <span className={styles.detailDate}>{selectedGumi.recordDate}</span>
                                <button className={styles.deleteButton} onClick={() => deleteGumi(selectedGumi.walkRecordId)}>삭제</button>
                            </div>
                            <p className={styles.detailText}>
                                <span className={styles.highlightedText}>{selectedGumi.startLocation}</span>에서부터<br />
                                <span className={styles.highlightedText}>{selectedGumi.endLocation}</span>까지의 산책을 하다<br />
                                거리: {selectedGumi.distance} m
                            </p>
                            <div className={styles.detailImage} onClick={() => document.getElementById('imageUpload').click()}>
                                {selectedGumi.imageUrl ? (
                                    <img src={selectedGumi.imageUrl} alt="Uploaded" />
                                ) : (
                                    '(사진)'
                                )}
                            </div>
                            <input
                                type="file"
                                id="imageUpload"
                                style={{ display: 'none' }}
                                onChange={handleImageUpload}
                            />
                            <div className={styles.detailRollupJelly}>
                                <img src={getJellyImage(selectedGumi.distance)} alt="Rollup Jelly" className={styles.jellyImage} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyGumiLogin;
