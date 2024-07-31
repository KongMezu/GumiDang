'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import styles from './work_save.module.css';

const WorkSavePage = () => {
    const [userName, setUserName] = useState('');
    const [date, setDate] = useState({ month: '', day: '' });
    const [startPosition, setStartPosition] = useState({ lat: 37.5665, lng: 126.9780 }); // 기본 좌표 설정
    const [endPosition, setEndPosition] = useState(null);
    const router = useRouter();

    useEffect(() => {
        // API 호출하여 사용자 이름과 날짜, 시작지점 정보 가져오기
        const fetchData = async () => {
            try {
                const response = await fetch('https://gummy-dang.com');
                const data = await response.json();
                setUserName(data.userName);
                setDate({ month: data.month, day: data.day });
                setStartPosition({ lat: data.startLat, lng: data.startLng }); // 백엔드에서 시작 지점 좌표 가져오기
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=d3745faf495bcce30edb681fb85a6b3b&autoload=false`;
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            window.kakao.maps.load(() => {
                const mapContainer = document.getElementById('map');
                const mapOption = {
                    center: new window.kakao.maps.LatLng(startPosition.lat, startPosition.lng),
                    level: 3,
                };
                const map = new window.kakao.maps.Map(mapContainer, mapOption);

                // 시작지점 표시
                const startMarker = new window.kakao.maps.Marker({
                    position: new window.kakao.maps.LatLng(startPosition.lat, startPosition.lng),
                    map: map,
                    title: '시작지점'
                });

                // 현재 위치 가져오기 = 도착지
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((position) => {
                        const endLat = position.coords.latitude;
                        const endLng = position.coords.longitude;

                        setEndPosition({ lat: endLat, lng: endLng });

                        const endMarker = new window.kakao.maps.Marker({
                            position: new window.kakao.maps.LatLng(endLat, endLng),
                            map: map,
                            title: '도착지점'
                        });

                        map.setCenter(new window.kakao.maps.LatLng(endLat, endLng));
                    });
                } else {
                    console.error('Geolocation is not supported by this browser.');
                }
            });
        };

        return () => script.remove();
    }, [startPosition]);

    const handleBack = () => {
        router.push('/');
    };

    const handleSave = () => {
        router.push('/mygumi_login');
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <FaArrowLeft className={styles.backArrow} onClick={handleBack} />
                <div className={styles.pageController}>...</div>
            </div>
            <div className={styles.content}>
                <h1 className={styles.title}>{`${date.month}월 ${date.day}일 ${userName}님은 이만큼 걸었어요!`}</h1>
                <div id="map" className={styles.map}></div>
                <div className={styles.rollupJelly}>롤업젤리</div>
                <button className={styles.photoButton}>사진 추가하기</button>
                <button onClick={handleSave} className={styles.saveButton}>오늘의 구미 저장하기</button>
            </div>
        </div>
    );
};

export default WorkSavePage;
