//아직 구현 중

'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { loadKakaoMap } from '../../utils/kakao'; // 경로 조정 필요
import styles from './postDetail.module.css'; // CSS 모듈 파일

const PostDetail = () => {
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);
    const [map, setMap] = useState(null);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (id) {
            const fetchPost = async () => {
                try {
                    const response = await axios.get(`/api/post/${id}`);
                    if (response.data.code === 'COM-000') {
                        setPost(response.data.data);
                    } else {
                        setError('해당 게시글을 찾을 수 없습니다.');
                    }
                } catch (error) {
                    setError('서버 오류가 발생했습니다.');
                }
            };

            fetchPost();
        }
    }, [id]);

    useEffect(() => {
        if (post) {
            const initializeMap = async () => {
                const kakao = await loadKakaoMap();
                const mapContainer = document.getElementById('map');
                const mapOption = {
                    center: new kakao.maps.LatLng(post.postCoordinates[0].latitude, post.postCoordinates[0].longitude),
                    level: 3,
                };
                const mapInstance = new kakao.maps.Map(mapContainer, mapOption);

                post.postCoordinates.forEach(coord => {
                    new kakao.maps.Marker({
                        position: new kakao.maps.LatLng(coord.latitude, coord.longitude),
                        map: mapInstance,
                        title: `Marker at ${coord.latitude}, ${coord.longitude}`,
                    });
                });

                setMap(mapInstance);
            };

            initializeMap();
        }
    }, [post]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>산책구경</h1>
            {post ? (
                <div>
                    <div className={styles.header}>
                        <div className={styles.userInfo}>
                            <span className={styles.username}></span>
                            <span className={styles.date}>작성 날짜</span>
                        </div>
                        <h2 className={styles.postTitle}>{post.title}</h2>
                    </div>
                    <p className={styles.description}>{post.description}</p>
                    <div id="map" className={styles.map}></div>
                    {post.imageUrl && (
                        <div className={styles.imageContainer}>
                            <img src={post.imageUrl} alt="게시글 이미지" className={styles.postImage} />
                        </div>
                    )}
                </div>
            ) : (
                <p className={styles.error}>불러오는 중...</p>
            )}
            {error && <p className={styles.error}>{error}</p>}
        </div>
    );
};

export default PostDetail;
