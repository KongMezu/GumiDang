/* 시작 위치 */
'use client';

import React, { useState, useEffect } from "react";
import { FaSearch, FaMapMarkerAlt, FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import styles from "./start.module.css";
import { loadKakaoMap } from "../utils/kakao";

const StartPage = () => {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [locations, setLocations] = useState([]);
    const [recordDate, setRecordDate] = useState(null);

    useEffect(() => {
        // 클라이언트 사이드에서만 searchParams를 가져오도록 처리
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const recordDateParam = urlParams.get('recordDate');
            setRecordDate(recordDateParam);
        }
    }, []);

    useEffect(() => {
        if (query.length > 0) {
            const handleSearch = async () => {
                const kakao = await loadKakaoMap();
                const ps = new kakao.maps.services.Places();
                ps.keywordSearch(query, (data, status) => {
                    if (status === kakao.maps.services.Status.OK) {
                        setLocations(data.slice(0, 7)); 
                    }
                });
            };

            handleSearch();
        } else {
            setLocations([]);
        }
    }, [query]);

    const handleLocationClick = (location) => {
        const params = new URLSearchParams({
            startLocation: location.place_name,
            startLat: location.y,
            startLon: location.x,
            recordDate
        });
        router.push(`/work_input?${params.toString()}`);
    };

    const handleCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;

                loadKakaoMap().then((kakao) => {
                    const geocoder = new kakao.maps.services.Geocoder();
                    geocoder.coord2Address(longitude, latitude, (result, status) => {
                        if (status === kakao.maps.services.Status.OK) {
                            const locationName = result[0].address.address_name;

                            const params = new URLSearchParams({
                                startLocation: locationName,
                                startLat: latitude,
                                startLon: longitude,
                                recordDate
                            });
                            router.push(`/work_input?${params.toString()}`);
                        } else {
                            alert('현재 위치를 받아오는 중 문제가 발생했습니다. 다시 시도해 주세요.');
                        }
                    });
                });
            });
        } else {
            alert("현재 위치를 사용할 수 없습니다.");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>시작지</h1>
            </div>
            <div className={styles.content}>
                <div className={styles.searchBoxWrapper}>
                    <div className={styles.searchBox}>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="동명(읍, 면)으로 검색 (ex. 서초동)"
                            className={styles.input}
                        />
                        <FaSearch className={styles.searchButton} />
                    </div>
                </div>
                <button className={styles.currentLocationButton} onClick={handleCurrentLocation}>
                    <FaMapMarkerAlt /> <span>현재 위치로 찾기</span>
                </button>
                <ul className={styles.locationList}>
                    {locations.map((location) => (
                        <li key={location.id} className={styles.locationItem} onClick={() => handleLocationClick(location)}>
                            {location.place_name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default StartPage;
