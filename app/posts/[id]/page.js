import axios from 'axios';
import { useRouter } from 'next/router';

const PostDetailPage = async () => {
  const router = useRouter();
  const { id } = router.query;

  // API에서 게시글 상세 내용을 가져옵니다.
  const { data } = await axios.get(`https://gummy-dang.com/posts/${id}`);

  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.content}</p>
      <Link href="https://gummy-dang.com//posts">목록으로 돌아가기</Link>
    </div>
  );
};

export default PostDetailPage;
