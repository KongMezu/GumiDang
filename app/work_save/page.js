/*
산책기록 입력하기 - 측정결과 페이지
1) 날짜(work_date) - 시작도착(work_input) - 거리 계산 완료 결과(work_save) : 페이지 컨트롤러로 이동
2) 하... 백이랑 연결해서 날짜, 유저이름 가져와야함
3) 백한테 산책기록 넘버, 시작지, 도착지, 직선거리 값 보내야함
*/
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import styles from './work_save.module.css';

const WorkSavePage = () => {
    const [userName, setUserName] = useState('');
    const [date, setDate] = useState({ month: '', day: '' });
    const [startPosition, setStartPosition] = useState({ lat: 37.5665, lng: 126.9780 }); // 기본 좌표 설정
    const [endPosition, setEndPosition] = useState(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    const startLat = parseFloat(searchParams.get('startLat'));
    const startLon = parseFloat(searchParams.get('startLon'));
    const endLat = parseFloat(searchParams.get('endLat'));
    const endLon = parseFloat(searchParams.get('endLon'));
    const distance = parseFloat(searchParams.get('distance'));
    const recordDate = searchParams.get('recordDate');

    useEffect(() => {
        // API 호출하여 사용자 이름과 날짜 정보 가져오기 / 와 모르겠습니다!
        const fetchData = async () => {
            try {
                const response = await fetch('https://gummy-dang.com/api/유저정보랑 날짜 어디');
                const data = await response.json();
                setUserName(data.userName);
                setDate({ month: data.month, day: data.day });
                setStartPosition({ lat: startLat, lng: startLon });
                setEndPosition({ lat: endLat, lng: endLon });
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        fetchData();
    }, [startLat, startLon, endLat, endLon]);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=d3745faf495bcce30edb681fb85a6b3b&autoload=false`;
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            window.kakao.maps.load(() => {
                const mapContainer = document.getElementById('map');
                const mapOption = {
                    center: new window.kakao.maps.LatLng(startLat, startLon),
                    level: 3,
                };
                const map = new window.kakao.maps.Map(mapContainer, mapOption);

                // 시작지점
                const startMarker = new window.kakao.maps.Marker({
                    position: new window.kakao.maps.LatLng(startLat, startLon),
                    map: map,
                    title: '시작지'
                });

                // 도착지점
                const endMarker = new window.kakao.maps.Marker({
                    position: new window.kakao.maps.LatLng(endLat, endLon),
                    map: map,
                    title: '도착지'
                });

                // 시작지점과 도착지점 사이의 직선거리 선 표시(안예쁨 꾸며야함)
                const linePath = [
                    new window.kakao.maps.LatLng(startLat, startLon),
                    new window.kakao.maps.LatLng(endLat, endLon)
                ];

                const polyline = new window.kakao.maps.Polyline({
                    path: linePath,
                    strokeWeight: 5,
                    strokeColor: '#FFAE00',
                    strokeOpacity: 0.7,
                    strokeStyle: 'solid'
                });

                polyline.setMap(map);

                // 지도 중심을 두 핀의 중간 지점으로 설정(계속 축소하래 미친것)
                const bounds = new window.kakao.maps.LatLngBounds();
                bounds.extend(new window.kakao.maps.LatLng(startLat, startLon));
                bounds.extend(new window.kakao.maps.LatLng(endLat, endLon));
                map.setBounds(bounds);
            });
        };

        return () => script.remove();
    }, [startLat, startLon, endLat, endLon]);

    const handleBack = () => {
        router.push('/');
    };

    const handleSave = async () => {
        // 백엔드로 거리 값 전송 - 응 안돼 :) 
        try {
            const response = await fetch('https://gummy-dang.com/api/record', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    recordTime: recordDate,
                    distance: distance,
                    departureLat: startLat,
                    departureLon: startLon,
                    arrivalLat: endLat,
                    arrivalLon: endLon,
                }),
            });

            if (!response.ok) {
                const errorMessage = `네트워크 응답이 올바르지 않습니다. 상태 코드: ${response.status}`;
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('백엔드 응답 데이터:', data);

            // mygumi_login 페이지로 이동
            router.push('/mygumi_login');

        } catch (error) {
            console.error('거리 전송 중 문제가 발생했습니다:', error);
        }
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
                <button onClick={handleSave} className={styles.saveButton}>오늘의 구미 저장하기</button>
            </div>
        </div>
    );
};

export default WorkSavePage;
