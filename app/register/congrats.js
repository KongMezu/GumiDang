/* 회원가입 축하 페이지 */

'use client';

import { useRouter } from 'next/navigation';
import styles from './Congrats.module.css';

const Congrats = () => {
  const router = useRouter();

  const handleGoToMemory = () => {
    router.push('/mygumi_login'); // 나의 산책(나의 구미) 페이지로 이동
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>구미당<br/>가입을 축하드립니다.</h1>
      <p className={styles.subtitle}>산책할 구미가 당기는<br/>구미당에서 같이 걸어요!</p>
      <img src="/image/fanfare.PNG" alt="Fanfare" className={styles.image} />
      <button className={styles.button} onClick={handleGoToMemory}>산책하러 가기</button>
    </div>
  );
};

export default Congrats;
