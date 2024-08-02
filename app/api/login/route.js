import axios from 'axios';
import { NextResponse } from 'next/server';

export async function post(req) {
  const { userName, password } = await req.json();

  try {
    const response = await axios.post('https://gummy-dang.com/api/login', { userName, password });

    if (response.data.code === 'COM-000') {
      const token = response.headers['authorization']; // 'Authorization' 소문자로 수정

      if (token) {
        const res = NextResponse.json({ code: 'COM-000', data: response.data.data });
        res.headers.set('Authorization', token); // 응답 헤더에 토큰 설정
        return res;
      } else {
        return NextResponse.json({ code: 'AUTH-ERROR', message: 'Token not found' }, { status: 401 });
      }
    } else {
      return NextResponse.json({ code: 'MEM-001' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ code: 'SERVER_ERROR', error: error.message }, { status: 500 });
  }
}
