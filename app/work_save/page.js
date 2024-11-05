/* 거리 측정 기록 페이지 */
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import Image from 'next/image';
import styles from './work_save.module.css';

//import dynamic from 'next/dynamic';
// import ModalReviewAddPath from './ModalReviewAddPath';



const WorkSavePage = () => {

    const [nickname, setNickName] = useState('');
    const [date, setDate] = useState({ month: '', day: '' });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [walkRecordId, setWalkRecordId] = useState(1);
    const [distance, setDistance] = useState(0);
    const router = useRouter();

    const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const startLat = urlParams ? parseFloat(urlParams.get('startLat')) : 0;
    const startLon = urlParams ? parseFloat(urlParams.get('startLon')) : 0;
    const endLat = urlParams ? parseFloat(urlParams.get('endLat')) : 0;
    const endLon = urlParams ? parseFloat(urlParams.get('endLon')) : 0;
    const recordDate = urlParams ? urlParams.get('recordDate') : '';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('AccessToken');
                if (token) {
                    setIsLoggedIn(true);
                    const [userResponse, recordsResponse] = await Promise.all([
                        axios.get('https://gummy-dang-server.com/api/member', {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                            },
                        }),
                        axios.get('https://gummy-dang-server.com/api/records', {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                            },
                        })
                    ]);

                    

                    const userData = userResponse.data.data;
                    const recordsData = recordsResponse.data;

                    setNickName(userData.nickname);
                    setDate({ month: recordDate.split('-')[1], day: recordDate.split('-')[2] });

                    if (recordsData.data && recordsData.data.walkRecordInfos) {
                        setWalkRecordId(recordsData.data.walkRecordInfos.length + 1);
                    } else {
                        setWalkRecordId(1); // 기본값 설정
                    }
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [recordDate]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const script = document.createElement('script');
            script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=d3745faf495bcce30edb681fb85a6b3b&libraries=services&autoload=false`;
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

                    const startMarker = new window.kakao.maps.Marker({
                        position: new window.kakao.maps.LatLng(startLat, startLon),
                        map: map,
                        title: 'Start Point'
                    });

                    const endMarker = new window.kakao.maps.Marker({
                        position: new window.kakao.maps.LatLng(endLat, endLon),
                        map: map,
                        title: 'End Point'
                    });

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

                    const bounds = new window.kakao.maps.LatLngBounds();
                    bounds.extend(new window.kakao.maps.LatLng(startLat, startLon));
                    bounds.extend(new window.kakao.maps.LatLng(endLat, endLon));
                    map.setBounds(bounds);

                    const toRad = (value) => value * Math.PI / 180;
                    const R = 6371e3; // metres
                    const φ1 = toRad(startLat);
                    const φ2 = toRad(endLat);
                    const Δφ = toRad(endLat - startLat);
                    const Δλ = toRad(endLon - startLon);

                    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                              Math.cos(φ1) * Math.cos(φ2) *
                              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

                    const d = R * c; // in metres
                    setDistance(d);
                });
            };

            return () => script.remove();
        }
    }, [startLat, startLon, endLat, endLon]);

    const handleBack = () => {
        router.push('/');
    };

    const handleSave = async () => {
        try {
            const response = await axios.post('https://gummy-dang-server.com/api/record', {
                walkRecordId,
                departureLat: startLat,
                departureLon: startLon,
                arrivalLat: endLat,
                arrivalLon: endLon,
                recordDate: recordDate,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('AccessToken')}`,
                }
            });

            const data = response.data;
            console.log('Backend response:', data);

            const params = new URLSearchParams({
                walkRecordId: walkRecordId.toString(),
                recordDate: data.data.recordTime,
                distance: data.data.distance,
                startLocation: `${data.data.departureLat}, ${data.data.departureLon}`,
                endLocation: `${data.data.arrivalLat}, ${data.data.arrivalLon}`,
                imageUrl: data.data.imageUrl || 'https://via.placeholder.com/70',
                jellyImage: getRollupJellyImage(data.data.distance)
            });

            router.push(`/mygumi_login?${params.toString()}`);

        } catch (error) {
            console.error('Error sending data:', error);
        }
    };

    const getRollupJellyImage = (distance) => {
        if (distance >= 10000) {
            return '/11.png';
        }
        const index = Math.floor(distance / 1000);
        return `/${index}.png`;
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
            </div>
            <div className={styles.content}>
                <h1 className={styles.title}>{`${date.month}월 ${date.day}일 ${nickname}님은 이만큼 걸었어요!`}</h1>
                <div id="map" className={styles.map}></div>
                
                <div className={styles.rollupJelly}>
                <Image src={getRollupJellyImage(distance)} alt="롤업젤리" layout="intrinsic" // 이미지 비율 유지
                    width={70}          // 원하는 너비 
                    height={70}         // 원하는 높이
                />
            </div>
                <button onClick={handleSave} className={styles.saveButton}>오늘의 구미 저장하기</button>
            </div>
        </div>
    );
};

export default WorkSavePage;
