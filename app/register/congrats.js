'use client';

import { useRouter } from 'next/navigation';

const Congrats = () => {
  const router = useRouter();

  const handleGoToMemory = () => {
    router.push('이동할 위치'); // 산책하기 페이지로 이동
  };

  return (
    <div>
      <h1>구미당<br/>가입을 축하드립니다.</h1>
      <p>산책할 구미가 당기는<br/>구미당에서 같이 걸어요!</p>
      <button onClick={handleGoToMemory}>산책하러 가기</button>
    </div>
  );
};

export default Congrats;
