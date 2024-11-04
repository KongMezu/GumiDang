'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './mygumi_login.module.css';
import { loadKakaoMap } from "../utils/kakao";
import Image from 'next/image';

const MyGumiLogin = () => {
    const router = useRouter();
    const [showDetail, setShowDetail] = useState(false);
    const [gumiList, setGumiList] = useState([]);
    const [rewardAvailable, setRewardAvailable] = useState(false);
    const [totalDistance, setTotalDistance] = useState(0);
    const [distanceImage, setDistanceImage] = useState('/0.png');
    const [draggingGumi, setDraggingGumi] = useState(null);
    const [selectedGumi, setSelectedGumi] = useState(null);
    const [isDropping, setIsDropping] = useState(false);
    const [searchParams, setSearchParams] = useState(null);
    const maxDistance = 100000;

    useEffect(() => {
        const resetReward = localStorage.getItem('rewardReset') === 'true';

        if (resetReward) {
            setTotalDistance(0); // totalDistance 초기화
            setDistanceImage('/0.png'); // distanceImage 초기화
            localStorage.setItem('totalDistance', 0); // localStorage에서도 초기화
            localStorage.setItem('distanceImage', '/0.png'); // localStorage에서 distanceImage도 초기화
            localStorage.removeItem('rewardReset'); // 플래그 제거
        } else {
            fetchGumiData(); // 기존 데이터 불러오기
        }
    }, []);


    useEffect(() => {
        if (typeof window !== 'undefined') {
            setSearchParams(new URLSearchParams(window.location.search));
            fetchGumiData();
        }
    }, []);

    useEffect(() => {
        if (searchParams) {
            const id = searchParams.get('walkRecordId');
            if (id) {
                fetchGumiDetail(id);
            }
        }
    }, [searchParams]);

    
    

    const fetchGumiData = async () => {
        try {
            const token = localStorage.getItem('AccessToken');
            const response = await axios.get('https://gummy-dang-server.com/api/records', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            
            const data = response.data;
            const walkRecordInfos = data.data.walkRecordInfos || [];

            const detailedRecords = await Promise.all(walkRecordInfos.map(async (record) => {
                const detailResponse = await axios.get(`https://gummy-dang-server.com/api/record?recordId=${record.walkRecordId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const distance = detailResponse.data.data.distance || 0;
                return { ...record, distance };
            }));
    
            setGumiList(detailedRecords);
            const isReset = localStorage.getItem('rewardReset') === 'true';
            const totalDistance = isReset ? 0 : detailedRecords.reduce((acc, record) => acc + parseFloat(record.distance || 0), 0);

                
            setTotalDistance(totalDistance);
            setRewardAvailable(totalDistance >= maxDistance);
            if (!isReset) {
                localStorage.setItem('totalDistance', totalDistance);
            }
        } catch (error) {
            console.error('Error fetching gumi data:', error);
            setTotalDistance(0);
        }
    };
    
    useEffect(() => {
        const totalDistance = gumiList.reduce((acc, record) => acc + parseFloat(record.distance || 0), 0);
        setTotalDistance(totalDistance);
        setRewardAvailable(totalDistance >= maxDistance);
        console.log("총 거리 (totalDistance):", totalDistance); // 확인용
    }, [gumiList]);

    const fetchGumiDetail = async (id) => {
        try {
            const token = localStorage.getItem('AccessToken');
            const response = await axios.get(`https://gummy-dang-server.com/api/record?recordId=${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log("API 응답:", response.data);
    
            const recordData = response.data.data;
            if (!recordData) throw new Error('No record data found');
    
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

                console.log("상세 Gumi 데이터:", detailedGumi);
                setSelectedGumi(detailedGumi);
                setShowDetail(true);
            }
        } catch (error) {
            console.error('Error fetching gumi detail:', error);
        }

    };

    const handleAddClick = () => {
        const newWalkRecordId = gumiList.length + 1;
        router.push(`/work_date?walkRecordId=${newWalkRecordId}`);
    };

    const handleGumiClick = async (gumi) => {
        fetchGumiDetail(gumi.walkRecordId);
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
            await axios.delete(`https://gummy-dang-server.com/api/record?recordId=${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const updatedGumiList = gumiList.filter(gumi => gumi.walkRecordId !== id);
            setGumiList(updatedGumiList);

            const newTotalDistance = updatedGumiList.reduce((acc, gumi) => acc + (gumi.distance || 0), 0);
            setTotalDistance(newTotalDistance);
            setRewardAvailable(newTotalDistance >= maxDistance);

            setShowDetail(false);
            setSelectedGumi(null);
        } catch (error) {
            console.error('Error deleting gumi:', error);
        }
    };

    const handleRewardClick = () => {
        handleRewardReset(); 
        router.push('/reward');
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file && selectedGumi) {
            const formData = new FormData();
            formData.append('image', file);

            try {
                const token = localStorage.getItem('AccessToken');
                const response = await axios.post(`https://gummy-dang-server.com/api/records/${selectedGumi.walkRecordId}/upload`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = response.data;
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

    const getTotalDistanceImage = (distance) => {
        if (distance >= maxDistance) return '/11.png';
        const index = Math.min(Math.floor((distance / maxDistance) * 10), 10);
        return `/${index}.png`;
    };

    const getRollupJellyImage = (distance) => {
        if (distance >= 10000) return '/11.png';
        const index = Math.floor(distance / 1000);
        return `/${index}.png`;
    };

    const handleRewardReset = () => {
        setTotalDistance(0);
        setDistanceImage('/0.png');
        localStorage.setItem('totalDistance', 0);
        localStorage.setItem('distanceImage', '/0.png');
        localStorage.setItem('rewardReset', 'true'); 
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>나의 구미</h1>
            </div>
            <div className={styles.content}>
                <div className={styles.gumiBox}>
                <div className={styles.gumiGrid}>
                        {gumiList.length > 0 && gumiList.map((gumi) => (
                            <div
                                key={gumi.walkRecordId}
                                className={`${styles.gumi} ${draggingGumi === gumi ? styles.draggingGumi : ''}`}
                                style={{ backgroundImage: `url('${gumi.gummyUrl}')` }}
                                onClick={() => handleGumiClick(gumi)}
                                draggable
                                onDragStart={() => handleDragStart(gumi)}
                                onDragEnd={handleDragEnd}
                            ></div>
                        ))}
                    </div>
                    <div className={styles.rollupJelly}>
                        <Image src={getTotalDistanceImage(totalDistance)} alt="Total Distance" width={200} height={200} />
                        {rewardAvailable && (
                            <div className={styles.rewardContainer}>
                                <button className={styles.rewardButton} onClick={handleRewardClick}>
                                    보상 수령하기
                                </button>
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
                                <span className={styles.highlightedText}>{selectedGumi.startLocation}</span> 에서부터<br />
                                <span className={styles.highlightedText}>{selectedGumi.endLocation}</span>까지의 산책을 하다<br />
                                거리: {selectedGumi.distance} m
                            </p>
                            <div className={styles.detailImage} onClick={() => document.getElementById('imageUpload').click()}>
                                {selectedGumi.imageUrl ? (
                                    <Image src={selectedGumi.imageUrl} alt="Uploaded" width={70} height={70} />
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
                                <Image
                                    src={getRollupJellyImage(selectedGumi.distance)}
                                    alt="Rollup Jelly"
                                    className={styles.jellyImage}
                                    width={200}
                                    height={200}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyGumiLogin;
