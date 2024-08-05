/*글 작성 페이지 디자인 수정 중 */
/*글 작성 오류 발생-원인 잘 모르겠음,, */

'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { loadKakaoMap, getAddressFromCoords } from '../utils/kakao'; // 카카오 맵 API 관련 유틸 함수들 import
import styles from './write.module.css'; // CSS 모듈 import

const WritePage = () => {
    // 상태 변수들 정의
    const [title, setTitle] = useState(''); // 코스 제목
    const [content, setContent] = useState(''); // 코스 설명
    const [error, setError] = useState(null); // 에러 메시지
    const [startLocation, setStartLocation] = useState({ address: '', latLng: null }); // 시작 위치
    const [endLocation, setEndLocation] = useState({ address: '', latLng: null }); // 도착 위치
    const [waypoints, setWaypoints] = useState([]); // 경유지 목록
    const [activeField, setActiveField] = useState(null); // 현재 활성화된 입력 필드
    const [mapLoaded, setMapLoaded] = useState(false); // 맵 로딩 상태
    const [imageFile, setImageFile] = useState(null); // 업로드된 이미지 파일
    const [imagePreview, setImagePreview] = useState(null); // 이미지 미리보기
    const mapRef = useRef(null); // 맵 인스턴스 참조
    const markerRef = useRef(null); // 마커 인스턴스 참조
    const router = useRouter(); // Next.js 라우터

    // 맵 초기화 및 마커 설정
    useEffect(() => {
        const initializeMap = async () => {
            const kakao = await loadKakaoMap(); // 카카오 맵 로드
            setMapLoaded(true); // 맵 로딩 완료 상태 업데이트
            const mapContainer = document.getElementById('map-start'); // 시작 위치 맵 컨테이너
            if (!mapContainer) return;

            const mapOption = {
                center: new kakao.maps.LatLng(37.5665, 126.978), // 서울 중심 좌표
                level: 3, // 줌 레벨
            };
            const map = new kakao.maps.Map(mapContainer, mapOption); // 맵 인스턴스 생성
            mapRef.current = map;

            const marker = new kakao.maps.Marker({
                position: map.getCenter(), // 맵 중심에 마커 설정
                map,
            });
            markerRef.current = marker;

            kakao.maps.event.addListener(map, 'dragend', () => {
                const latLng = map.getCenter(); // 드래그 후 맵 중심 좌표 업데이트
                marker.setPosition(latLng); // 마커 위치 업데이트
            });
        };

        initializeMap();
    }, []);

    // 특정 입력 필드에 맞는 맵 로드 및 마커 설정
    useEffect(() => {
        if (mapLoaded && activeField !== null) {
            const mapContainer = document.getElementById(`map-${activeField}`);
            if (mapContainer) {
                const kakao = window.kakao;
                const mapOption = {
                    center: new kakao.maps.LatLng(37.5665, 126.978), // 서울 중심 좌표
                    level: 3, // 줌 레벨
                };
                const map = new kakao.maps.Map(mapContainer, mapOption); // 맵 인스턴스 생성
                mapRef.current = map;

                const marker = new kakao.maps.Marker({
                    position: map.getCenter(), // 맵 중심에 마커 설정
                    map,
                });
                markerRef.current = marker;

                kakao.maps.event.addListener(map, 'dragend', () => {
                    const latLng = map.getCenter(); // 드래그 후 맵 중심 좌표 업데이트
                    marker.setPosition(latLng); // 마커 위치 업데이트
                });

                // 선택 버튼 보이기
                const selectButton = document.getElementById(`select-button-${activeField}`);
                if (selectButton) {
                    selectButton.style.display = 'block'; // 버튼 표시
                }
            }
        }
    }, [mapLoaded, activeField]);

    // 위치 선택 버튼 클릭 시 처리
    const handleSelectLocation = async () => {
        if (mapRef.current) {
            const latLng = mapRef.current.getCenter(); // 맵 중심 좌표 가져오기
            const address = await getAddressFromCoords(latLng); // 좌표로 주소 가져오기
            if (activeField === 'start') {
                setStartLocation({ address, latLng }); // 시작 위치 업데이트
            } else if (activeField === 'end') {
                setEndLocation({ address, latLng }); // 도착 위치 업데이트
            } else if (activeField !== null && activeField.startsWith('waypoint-')) {
                const index = parseInt(activeField.split('-')[1], 10); // 경유지 인덱스 추출
                const newWaypoints = [...waypoints];
                newWaypoints[index] = { address, latLng }; // 경유지 업데이트
                setWaypoints(newWaypoints);
            }
            setActiveField(null); // 활성화된 필드 초기화
        }
    };

    // 경유지 추가 버튼 클릭 시 처리
    const handleAddWaypoint = () => {
        if (waypoints.length < 4) {
            setWaypoints([...waypoints, { address: '', latLng: null }]); // 경유지 추가
        }
    };

    // 이미지 파일 변경 시 처리
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file); // 이미지 파일 상태 업데이트
            setImagePreview(URL.createObjectURL(file)); // 이미지 미리보기 업데이트
        }
    };

    // 폼 제출 처리
    const handleSubmit = async (e) => {
        e.preventDefault(); // 기본 제출 동작 방지

        // 좌표 리스트 생성
        const postCoordinates = [
            {
                latitude: startLocation.latLng?.getLat(),
                longitude: startLocation.latLng?.getLng(),
            },
            ...waypoints.map((point) => ({
                latitude: point.latLng?.getLat(),
                longitude: point.latLng?.getLng(),
            })),
            {
                latitude: endLocation.latLng?.getLat(),
                longitude: endLocation.latLng?.getLng(),
            },
        ].filter((point) => point.latitude && point.longitude); // 유효한 좌표만 필터링

        if (postCoordinates.length > 6) {
            setError('좌표값은 6개 이하이어야 합니다.'); // 좌표 개수 제한 확인
            return;
        }

        // 폼 데이터 생성
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', content);
        formData.append('imageUrl', imageFile); // 이미지 파일 추가
        formData.append('postCoordinates', JSON.stringify(postCoordinates)); // 좌표값 리스트 추가

        const accessToken = localStorage.getItem('AccessToken'); // 로컬 스토리지에서 액세스 토큰 가져오기

        try {
            // API 요청
            const response = await axios.post('https://gummy-dang.com/api/post/create', formData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`, // 인증 헤더
                    'Content-Type': 'multipart/form-data', // 멀티파트 데이터 전송
                },
            });

            // 성공 시 게시물 목록으로 이동
        if (response.data.code === 'COM-000') {
            router.push('/posts');
        } else {
            // 서버에서 반환하는 에러 코드와 메시지 확인
            setError(`글 작성에 실패했습니다. 오류 코드: ${response.data.code}, 메시지: ${response.data.message || '알 수 없는 오류'}`);
        }
    } catch (error) {
        // 네트워크 오류 또는 서버 응답 처리 오류
        if (error.response) {
            // 서버에서 응답이 있었고, 그 응답에 대한 정보를 확인
            setError(`서버 오류 발생: ${error.response.data.message || '알 수 없는 서버 오류'}`);
        } else if (error.request) {
            // 요청이 서버에 도달하지 않은 경우
            setError('서버에 요청을 보내지 못했습니다. 네트워크 문제를 확인하세요.');
        } else {
            // 오류를 발생시킨 코드
            setError(`문제가 발생했습니다: ${error.message}`);
        }
    }
};
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>산책코스 작성</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>
                        코스 이름 <span className={styles.subLabel}>(4자 이상)</span>
                    </label>
                    <input
                        className={styles.input}
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="ex. 우리 동네 한바퀴!"
                        required
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>코스 입력</label>
                    <span className={styles.subLabel}>최대 6곳을 입력할 수 있어요.</span>
                    <div className={styles.locationInputGroup}>
                        <label className={styles.locationInput}></label>
                        <input
                            className={styles.locationInputField}
                            type="text"
                            value={startLocation.address}
                            onFocus={() => setActiveField('start')}
                            readOnly
                            placeholder="산책 시작한 곳을 검색해요."
                        />
                        {activeField === 'start' && (
                            <div className={styles.mapContainer}>
                                <div id="map-start" className={styles.map}></div>
                                <button
                                    id="select-button-start"
                                    type="button"
                                    className={styles.selectButton}
                                    onClick={handleSelectLocation}
                                >
                                    선택
                                </button>
                            </div>
                        )}
                    </div>
                    {waypoints.map((waypoint, index) => (
                        <div key={index} className={styles.inputGroup}>
                            <label className={styles.locationInput}></label>
                            <input
                                className={styles.locationInputField}
                                type="text"
                                value={waypoint.address}
                                onFocus={() => setActiveField(`waypoint-${index}`)}
                                readOnly
                                placeholder="지나간 산책지"
                            />
                            {activeField === `waypoint-${index}` && (
                                <div className={styles.mapContainer}>
                                    <div id={`map-waypoint-${index}`} className={styles.map}></div>
                                    <button
                                        id={`select-button-waypoint-${index}`}
                                        type="button"
                                        className={styles.selectButton}
                                        onClick={handleSelectLocation}
                                    >
                                        선택
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                    <div className={styles.inputGroup}>
                        <label className={styles.locationInput}></label>
                        <input
                            className={styles.locationInputField}
                            type="text"
                            value={endLocation.address}
                            onFocus={() => setActiveField('end')}
                            readOnly
                            placeholder="산책 도착한 곳을 검색해요."
                        />
                        {activeField === 'end' && (
                            <div className={styles.mapContainer}>
                                <div id="map-end" className={styles.map}></div>
                                <button
                                    id="select-button-end"
                                    type="button"
                                    className={styles.selectButton}
                                    onClick={handleSelectLocation}
                                >
                                    선택
                                </button>
                            </div>
                        )}
                    </div>
                    <div className={styles.addWaypointButtonContainer}>
                        <button type="button" className={styles.addWaypointButton} onClick={handleAddWaypoint}>+ 경유지 추가</button>
                    </div>
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>사진</label>
                    <input
                        className={styles.imageInput}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    {imagePreview && (
                        <div className={styles.imagePreviewContainer}>
                            <img
                                className={styles.imagePreview}
                                src={imagePreview}
                                alt="Image Preview"
                            />
                        </div>
                    )}
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>코스 설명</label>
                    <textarea
                        className={styles.textarea}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="내가 선택한 곳을 모두에게 자랑해요!"
                        required
                    />
                </div>
                <button type="submit" className={styles.submitButton}>작성 완료</button>
                {error && <p className={styles.error}>{error}</p>}
            </form>
        </div>
    );
};

export default WritePage;
