/*
나의 구미 로그인시(구미가 모였을 시) 보이는 화면

해야할거:
1) 롤업젤리 합계  - 이 또한 임시로 만듬 
거리 누적 합계 100Km(10Km 끊어서 그림 채워주기 / 100km) 달성하면
롤업젤리 위에 보상 수령하기 초록 버튼 생성(폭죽과 함께)
누르면 리워드 확인 페이지 
-> 이미지 보여주는거, 누적합계 모두 백엔드에서 계속 가져와야함

2) gumi - 임시로 만듬 백이 연결 안대서.
백엔드에서 젤리이미지 불러와서 랜덤으로 넣기 

gumi 를 길게 누르면 커서가 움직이는대로 따라와서 
하단 + 버튼에서 + 모양이 X 모양으로 바뀌면서 
X모양으로 바뀐 버튼에 gumi를 가져다 놓으면 그 gumi는 삭제함 안에 들어간 이름까지 전부 다.

gumi를 클릭하겸 보이는 showDetail : 내용은 순서대로 불러와야함(날짜, 시작지, 도착지 이름, 걸었던 기록) + 사진 업로드 + 삭제기능


*/

    // useEffect(() => {
    //     // 백엔드 젤리 이미지 랜덤으로 불러오기
    //     fetchGumiData();
    // }, []);

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaBars } from 'react-icons/fa'; 
import styles from './mygumi_login.module.css';

const MyGumiLogin = () => {
    const router = useRouter();
    const [showDetail, setShowDetail] = useState(false);
    const [gumiList, setGumiList] = useState([]);
    const [rewardAvailable, setRewardAvailable] = useState(false);
    const [totalDistance, setTotalDistance] = useState(0);
    const [draggingGumi, setDraggingGumi] = useState(null);
    const [selectedGumi, setSelectedGumi] = useState(null);
    const [isDropping, setIsDropping] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        // 임시 구미
        const tempGumi = {
            id: 1,
            imageUrl: 'https://via.placeholder.com/70',
            date: '2024-08-02',
            startLocation: '가톨릭대학교 성심교정',
            endLocation: '역곡역 1호선',
            distance: 300,
            image: null 
        };
        setGumiList([tempGumi]);
        setTotalDistance(300);
    }, []);

    const handleBackClick = () => {
        router.push('/work_date');
    };

    const handleMenuClick = () => {
        // 햄버거 메뉴 동작 추가
    };

    const handleAddClick = () => {
        router.push('/work_date');
    };

    const handleGumiClick = (gumi) => {
        setSelectedGumi(gumi);
        setShowDetail(true);
    };

    const handleDetailCloseClick = () => {
        setShowDetail(false);
        setSelectedGumi(null);
        setTimeout(() => {
            setRewardAvailable(true); // 임시 보상활성화 
            setShowConfetti(true); // 폭죽(된다면 구성)
            setTimeout(() => setShowConfetti(false), 3000); // 폭죽 - 3초 후 비활성화
        }, 1000); // 1초 뒤 보상 활성화
    };

    const handleDragStart = (gumi) => {
        setDraggingGumi(gumi);
        setIsDropping(true);
    };

    const handleDragEnd = () => {
        setDraggingGumi(null);
        setIsDropping(false);
    };

    const handleDrop = () => {
        if (draggingGumi) {
            deleteGumi(draggingGumi.id);
            setDraggingGumi(null);
            setIsDropping(false);
        }
    };

    const deleteGumi = (id) => {
        const updatedGumiList = gumiList.filter(gumi => gumi.id !== id);
        setGumiList(updatedGumiList);
        setShowDetail(false);
        setSelectedGumi(null);
    };

    const handleRewardClick = () => {
        router.push('/reward');
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file && selectedGumi) {
            const formData = new FormData();
            formData.append('image', file);

            try {//백 또 안됨.
                const response = await fetch(`https://gummy-dang.com/api/record/${selectedGumi.id}/upload`, {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Image upload response:', data);
                    setSelectedGumi(prev => ({ ...prev, image: data.imageUrl }));
                    const updatedGumiList = gumiList.map(gumi =>
                        gumi.id === selectedGumi.id ? { ...gumi, image: data.imageUrl } : gumi
                    );
                    setGumiList(updatedGumiList);
                } else {
                    console.error('Image upload failed');
                }
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <FaArrowLeft className={styles.backArrow} onClick={handleBackClick} />
                <h1 className={styles.title}>나의 구미</h1>
                <FaBars className={styles.menuButton} onClick={handleMenuClick} />
            </div>
            <div className={styles.content}>
                <div className={styles.gumiBox}>
                    <div className={styles.gumiGrid}>
                        {gumiList.length > 0 && gumiList.map((gumi) => (
                            <div
                                key={gumi.id}
                                className={`${styles.gumi} ${draggingGumi === gumi ? styles.draggingGumi : ''}`}
                                style={{ backgroundImage: `url(${gumi.imageUrl})` }}
                                onClick={() => handleGumiClick(gumi)}
                                draggable
                                onDragStart={() => handleDragStart(gumi)}
                                onDragEnd={handleDragEnd}
                            ></div>
                        ))}
                    </div>
                    <div className={styles.rollupJelly}>
                        롤업젤리 합계
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
                                <span className={styles.detailDate}>{selectedGumi.date}</span>
                                <button className={styles.deleteButton} onClick={() => deleteGumi(selectedGumi.id)}>X</button>
                            </div>
                            <p className={styles.detailText}>
                                <strong>&#39;{selectedGumi.startLocation}&#39;</strong> 에서부터 <strong>&#39;{selectedGumi.endLocation}&#39;</strong> 까지의 산책을 하다<br />
                                <strong>거리 표시: {selectedGumi.distance} m</strong>
                            </p>
                            <div className={styles.detailImage} onClick={() => document.getElementById('imageUpload').click()}>
                                {selectedGumi.image ? (
                                    <img src={selectedGumi.image} alt="Uploaded" />
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
                            <div className={styles.detailRollupJelly}>롤업젤리_개별</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyGumiLogin;
