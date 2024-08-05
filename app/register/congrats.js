/*회원가입 축하 페이지 */

'use client';

import { useRouter } from 'next/navigation';

const Congrats = () => {
  const router = useRouter();

  const handleGoToMemory = () => {
    router.push('/mygumi_login'); // 나의 산책(나의 구미)
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
