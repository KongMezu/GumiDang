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
            try {
                const response = await axios.get('https://gummy-dang.com/api/post/list');
                if (response.data.code === 'COM-000') {
                    setPosts(response.data.data);
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
        router.push('/write'); // 페이지를 '/write'로 설정
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>산책구경</h1>
            <div className={styles.grid}>
                {posts.map((post) => (
                    <div key={post.id} className={styles.post} onClick={() => handlePostClick(post.id)}>
                        {post.imageUrl && <img src={post.imageUrl} alt={post.title} className={styles.image} />}
                        <h2 className={styles.title}>{post.title}</h2>
                    </div>
                ))}
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <button className={styles.writeButton} onClick={handleWriteClick}>+</button>
        </div>
    );
};

export default PostsList;
