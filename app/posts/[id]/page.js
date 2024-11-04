'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './postDetail.module.css'; // 스타일 모듈
import { loadKakaoMap, getAddressFromCoords } from '../../utils/kakao'; // 카카오 지도 관련 유틸
import Image from 'next/image';

const PostDetail = ({ params }) => {
    const [post, setPost] = useState(null);
    const [map, setMap] = useState(null);
    const [address, setAddress] = useState('');
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [kakao, setKakao] = useState(null);
    const [nickname, setNickname] = useState(""); // 유저 닉네임 상태

    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const storedNickname = localStorage.getItem('Nickname'); // 로컬 스토리지 닉네임 수집
                const accessToken = localStorage.getItem('AccessToken'); // 로컬 스토리지에서 액세스 토큰 가져오기

                if (storedNickname) {
                    setNickname(storedNickname); // 닉네임 상태 업데이트
                }

                const response = await axios.get(`https://gummy-dang-server.com/api/post/${params.id}`, {
                    headers: {
                        'Authorization': accessToken, // 인증 헤더 추가
                    },
                });

                if (response.data.code === 'COM-000') {
                    setPost(response.data.data);
                    if (response.data.data.postCoordinates.length > 0) {
                        const kakao = await loadKakaoMap();
                        setKakao(kakao);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch post details:', error);
            }
        };

        fetchPostDetails();
    }, [params.id]);

    useEffect(() => {
        if (kakao && post && post.postCoordinates.length > 0) {
            const mapContainer = document.getElementById('map');
            const mapOptions = {
                center: new kakao.maps.LatLng(post.postCoordinates[0].latitude, post.postCoordinates[0].longitude),
                level: 3,
            };
            const kakaoMap = new kakao.maps.Map(mapContainer, mapOptions);
            setMap(kakaoMap);

            post.postCoordinates.forEach((coords) => {
                const position = new kakao.maps.LatLng(coords.latitude, coords.longitude);
                const marker = new kakao.maps.Marker({ position });
                marker.setMap(kakaoMap);
                kakao.maps.event.addListener(marker, 'click', async () => {
                    const addr = await getAddressFromCoords(position);
                    setAddress(addr);
                    setSelectedMarker(position);
                });
            });

            const bounds = new kakao.maps.LatLngBounds();
            post.postCoordinates.forEach((coords) => {
                bounds.extend(new kakao.maps.LatLng(coords.latitude, coords.longitude));
            });
            kakaoMap.setBounds(bounds);
        }
    }, [kakao, post]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{post ? post.title : '로딩 중...'}</h1>
            <div className={styles.info}>
                <div className={styles.username}>{nickname}</div>
                <div className={styles.date}>{post ? new Date(post.createdAt).toLocaleDateString() : '작성 날짜'}</div>
            </div>
            <div className={styles.separator}></div>
            <div className={styles.postTitle}>{post ? post.title : ''}</div>
            <div className={styles.descriptionContainer}>
                <Image src="/image/pencil.PNG" alt="Edit" className={styles.icon}
                width={50} // 원하는 가로 크기
                height={50} // 기본 높이로 설정
                />
                <div className={styles.description}>{post ? post.description : ''}</div>
            </div>
            <div className={styles.mapAndImageContainer}>
                <div id="map" className={styles.map}></div>
                <div className={styles.imageSlider}>
                    <Image src={post ? post.imageUrl : '/image/default.png'} alt="Post Image" 
                    className={styles.image} 
                    width={200} // 원하는 가로 크기
                    height={200} // 기본 높이로 설정
                    layout="responsive" // 비율을 유지하도록 설정
                    />
                </div>
            </div>
            {address && <div className={styles.address}>{address}</div>}
        </div>
    );
};

export default PostDetail;
