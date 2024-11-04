/*도착,시작 위치 입력 페이지 */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import styles from './work_input.module.css';
import { loadKakaoMap } from "../utils/kakao";

const InputPage = () => {
    const router = useRouter();
    const [startLocation, setStartLocation] = useState('');
    const [startLat, setStartLat] = useState(null);
    const [startLon, setStartLon] = useState(null);
    const [endLocation, setEndLocation] = useState('');
    const [endLat, setEndLat] = useState(null);
    const [endLon, setEndLon] = useState(null);
    const [recordDate, setRecordDate] = useState('');

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const recordDateFromQuery = urlParams.get('recordDate');
        console.log(`Received recordDate: ${recordDateFromQuery}`);

        if (recordDateFromQuery) {
            setRecordDate(recordDateFromQuery);
        }

        const startLocationFromQuery = urlParams.get('startLocation');
        const startLatFromQuery = urlParams.get('startLat');
        const startLonFromQuery = urlParams.get('startLon');

        if (startLocationFromQuery && startLatFromQuery && startLonFromQuery) {
            setStartLocation(startLocationFromQuery);
            setStartLat(parseFloat(startLatFromQuery));
            setStartLon(parseFloat(startLonFromQuery));
        }
    }, []);

    const handleStartClick = () => {
        router.push(`/work_start?recordDate=${recordDate}`);
    };

    const handleEndClick = () => {
        if (typeof window !== "undefined" && "geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                setEndLat(latitude);
                setEndLon(longitude);

                const kakao = await loadKakaoMap();
                const geocoder = new kakao.maps.services.Geocoder();

                geocoder.coord2Address(longitude, latitude, (result, status) => {
                    if (status === kakao.maps.services.Status.OK) {
                        const locationName = result[0].address.address_name;
                        setEndLocation(locationName);
                        console.log(`End Location: ${locationName}`); // Debugging line
                    } else {
                        alert('현재 위치를 받아오는 중 문제가 발생했습니다. 다시 시도해 주세요.');
                    }
                });
            }, (error) => {
                console.error(error);
                alert('현재 위치를 받아오는 중 문제가 발생했습니다. 다시 시도해 주세요.');
            });
        } else {
            alert("현재 위치를 사용할 수 없습니다.");
        }
    };

    const handleMeasureClick = () => {
        if (startLocation && endLocation) {
            const params = new URLSearchParams({
                startLat,
                startLon,
                endLat,
                endLon,
                recordDate,
            });

            router.push(`/work_count_dis?${params.toString()}`);
        } else {
            alert('시작 위치와 도착 위치를 모두 선택해 주세요.');
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>산책기록 입력하기</h1>
            <div className={styles.section} style={{ '--section-margin-top': 'calc(100px - 50px + 5vh)' }}>
                <div className={`${styles.labelWrapper} ${styles.start}`}>
                    <span className={styles.iconWrapper}>
                        <FaMapMarkerAlt />
                    </span>
                    <span className={styles.label}>시작</span>
                </div>
                <div className={styles.searchBox} onClick={handleStartClick}>
                    <span className={styles.searchInput}>{startLocation || '시작한 곳을 검색하세요'}</span>
                    <span className={styles.searchIcon}>
                        <FaSearch />
                    </span>
                </div>
            </div>
            <div className={styles.section} style={{ '--section-margin-top': 'calc(30px - 10px + 5vh)' }}>
                <div className={`${styles.labelWrapper} ${styles.end}`}>
                    <span className={styles.label}>도착</span>
                    <span className={`${styles.iconWrapper} ${styles.end}`}>
                        <FaMapMarkerAlt />
                    </span>
                </div>
                <div className={styles.searchBox} onClick={handleEndClick}>
                    <span className={styles.searchInput}>{endLocation || '도착한 곳을 검색하세요'}</span>
                    <span className={styles.searchIcon}>
                        <FaSearch />
                    </span>
                </div>
            </div>
            <button
                className={styles.button}
                onClick={handleMeasureClick}
                disabled={!startLocation || !endLocation}
            >
                거리 측정하기
            </button>
        </div>
    );
};

export default InputPage;
