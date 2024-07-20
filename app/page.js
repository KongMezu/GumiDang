'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import styles from './page.module.css';

const HomePage = () => {
  const router = useRouter();
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');

  const handleStartClick = () => {
    router.push('/start');
  };

  const handleEndClick = () => {
    router.push('/arrive');
  };

  const handleMeasureClick = () => {
    if (startLocation && endLocation) {
      router.push('/count_dis');
    } else {
      alert('Please select both start and end locations');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>산책기록 입력하기</h1>
      <div className={styles.section} style={{ '--section-margin-top': 'calc(100px - 50px + 5vh)' }}>
        <div className={styles.labelWrapper} style={{ '--label-wrapper-justify': 'flex-start' }}>
          <span className={styles.iconWrapper}>
            <FaMapMarkerAlt />
          </span>
          <span className={styles.label}>시작</span>
        </div>
        <div className={styles.searchBox} onClick={handleStartClick}>
          <span className={styles.searchInput}>시작한 곳을 검색하세요</span>
          <span className={styles.searchIcon}>
            <FaSearch />
          </span>
        </div>
      </div>
      <div className={styles.section} style={{ '--section-margin-top': 'calc(30px - 10px + 5vh)' }}>
        <div className={styles.labelWrapper} style={{ '--label-wrapper-justify': 'flex-end' }}>
          <span className={styles.label} style={{ '--label-margin-right': '10px' }}>도착</span>
          <span className={styles.iconWrapper} style={{ '--icon-margin-left': '5px' }}>
            <FaMapMarkerAlt />
          </span>
        </div>
        <div className={styles.searchBox} onClick={handleEndClick}>
          <span className={styles.searchInput}>도착한 곳을 검색하세요</span>
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

export default HomePage;
