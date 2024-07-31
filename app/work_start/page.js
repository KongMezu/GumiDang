"use client";

import React, { useState, useEffect } from "react";
import { FaSearch, FaMapMarkerAlt, FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import styles from "./start.module.css";
import { loadKakaoMap } from "../utils/kakao";

const StartPage = () => {
const router = useRouter();
const [query, setQuery] = useState("");
const [locations, setLocations] = useState([]);
const [selectedLocation, setSelectedLocation] = useState(null);

useEffect(() => {
    const handleSearch = async () => {
    if (query.length > 0) {
        const kakao = await loadKakaoMap();
        const ps = new kakao.maps.services.Places();
        ps.keywordSearch(query, (data, status) => {
        if (status === kakao.maps.services.Status.OK) {
            setLocations(data.slice(0, 7)); // 검색 결과 최대 7개 표시
        }
        });
    } else {
        setLocations([]);
    }
    };

    handleSearch();
}, [query]);

const handleLocationClick = async (location) => {
    setSelectedLocation(location);
    
    // 선택된 시작지 주소를 백엔드로 전송
    try {
    const response = await fetch('https://gummy-dang.com', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ startLocation: location.place_name }),
    });

    if (!response.ok) {
        throw new Error('네트워크 응답이 올바르지 않습니다.');
    }
    
      // 페이지 이동
    router.push({
        pathname: "/work_input",
        query: { startLocation: location.place_name },
    });
    } catch (error) {
    console.error('시작 위치 전송 중 문제가 발생했습니다:', error);
    alert('시작 위치 전송 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
};

const handleCurrentLocation = () => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        router.push({
        pathname: "/work_save",
        query: { lat: latitude, lng: longitude },
        });
    });
    } else {
    alert("현재 위치를 사용할 수 없습니다.");
    }
};


return (
    <div className={styles.container}>
    <div className={styles.header}>
        <FaArrowLeft className={styles.backArrow} onClick={() => router.push("/work_input")} />
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
