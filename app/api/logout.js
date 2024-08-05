export default async function handler(req, res) {
    if (req.method === 'POST') {
      // 로그아웃 처리 로직
      // 쿠키나 세션에서 사용자 정보를 제거
  
      res.status(200).json({ message: 'Logout successful' });
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  /*로그아웃 기능 구현*/