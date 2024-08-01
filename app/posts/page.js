import axios from 'axios';
import Link from 'next/link';

const PostsPage = async () => {
  const { data } = await axios.get('https://gummy-dang.com/posts');

  return (
    <div>
      <h1>게시판</h1>
      <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {data.map((post) => (
          <li key={post.id} style={{ width: '45%' }}>
            <Link href={`/posts/${post.id}`}>
              <a>{post.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostsPage;
