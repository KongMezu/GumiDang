/*게시판페이지 같음
개선점 : 시작 위치, 도착 위치가 제대로 입력이 안됨 */

'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { loadKakaoMap, getAddressFromCoords } from '../utils/kakao'; // 카카오 맵 API 관련 유틸 함수들 import
import styles from './write.module.css'; // CSS 모듈 import
import Image from 'next/image';


const WritePage = () => {
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
    const [postId, setPostId] = useState(null); // 게시글 ID

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

    // 특정 위치 선택 버튼 클릭 시 처리
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

        const accessToken = localStorage.getItem('AccessToken'); // 로컬 스토리지에서 액세스 토큰 가져오기

        // formData 객체 생성 및 데이터 추가 (이미지 URL 제외)
        const creatingData = {
            title: title,
            description: content,
            postCoordinates: postCoordinates,
        };

        try {
            // 게시글 데이터 전송
            const response = await axios.post('https://gummy-dang-server.com/api/post', creatingData, {
                headers: {
                    'Authorization': accessToken, // 인증 헤더
                },
            });
            if (response.data.code === 'COM-000') {
                const createdPostId = response.data.data.postId; // 생성된 게시글 ID 가져오기
                setPostId(createdPostId);
                await uploadImage(createdPostId); // Call the uploadImage function with the created post ID
            } else {
                setError('글 작성에 실패했습니다.'); // 실패 시 에러 메시지 설정
            }
        } catch (error) {
            console.error('Error details:', error); // 자세한 에러 정보 출력
            setError('서버 오류가 발생했습니다.');
        }
    };
        //여기까지 성공
        // 이미지 파일 변경 시 처리
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file); // 이미지 파일 상태 업데이트
            setImagePreview(URL.createObjectURL(file)); // 이미지 미리보기 업데이트
        }
    };
    const uploadImage = async (postId) => {
        const accessToken = localStorage.getItem('AccessToken'); // 로컬 스토리지에서 액세스 토큰 가져오기
        console.log(accessToken);
        // 이미지 업로드 후 URL 얻기
        const formdata = new FormData();
        formdata.append('file', imageFile); // 업로드할 이미지 파일 추가
        try {
            const response = await axios.post(`https://gummy-dang-server.com/api/image/post?postId=${postId}`, formdata, {
                headers: {
                    'Authorization': accessToken,
                    'Content-Type': 'multipart/form-data', // 멀티파트 데이터 타입 설정
                },
            });
            if (response.data.code === 'COM-000') {
                // 성공 시 게시물 목록으로 이동
                router.push('/posts');
            } else {
                setError('이미지 업로드에 실패했습니다.');
                return null;
            }
        } catch (error) {
            console.error('Error details:', error); // 자세한 에러 정보 출력
            setError('서버 오류가 발생했습니다.');
            return null;
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
                    <label className={styles.label}>사진&ensp;&ensp;&ensp;  </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    {imagePreview && (
                        <Image
                            src={imagePreview}
                            alt="미리보기"
                            className={styles.imagePreview}
                            width={400} // 원하는 가로 크기
                            height={0} // 높이 자동 계산
                            style={{ objectFit: 'contain', height: 'auto' }}
                        />
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
                {error && <div className={styles.error}>{error}</div>}
            </form>
        </div>
    );
};

export default WritePage;
