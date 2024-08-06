'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import styles from './posts.module.css'; // CSS 모듈 파일

const PostsList = () => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchPosts = async () => {
            const accessToken = localStorage.getItem('AccessToken'); // 로컬 스토리지에서 액세스 토큰 가져오기
            try {
                const response = await axios.get('https://gummy-dang.com/api/post/list', {
                    headers: {
                        'Authorization': accessToken, // 인증 헤더 추가
                    },
                });
                if (response.data.code === 'COM-000') {
                    // ID 순서대로 정렬 (작은 숫자 순서)
                    setPosts(response.data.data.sort((a, b) => a.id - b.id));
                } else {
                    setError('게시글을 불러오는 데 실패했습니다.');
                }
            } catch (error) {
                setError('서버 오류가 발생했습니다.');
            }
        };

        fetchPosts();
    }, []);

    const handlePostClick = (id) => {
        router.push(`/posts/${id}`);
    };

    const handleWriteClick = () => {
        router.push('/write');
    };

    return (
        <div className={styles.container}>
            <button className={styles.writeButton} onClick={handleWriteClick}>+</button>
            <h1 className={styles.title}>산책구경</h1>
            <div className={styles.grid}>
                {posts.map((post) => (
                    <div key={post.id} className={styles.post} onClick={() => handlePostClick(post.id)}>
                        {post.imageUrl && <img src={post.imageUrl} alt={post.title} className={styles.image} />}
                        <h2 className={styles.postTitle}>{post.title}</h2>
                    </div>
                ))}
            </div>
            {error && <p className={styles.error}>{error}</p>}
        </div>
    );
};

export default PostsList;
