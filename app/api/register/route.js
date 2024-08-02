import axios from 'axios';
import { NextResponse } from 'next/server';

export async function post(req) {
  const { userName, password, nickname } = await req.json();

  try {
    // 백엔드에 이메일 중복 검사 요청
    /*const checkResponse = await axios.post('YOUR_BACKEND_EMAIL_CHECK_URL', { userName });

    if (checkResponse.data.exists) {
      return NextResponse.json({ code: 'EMAIL_DUPLICATE', message: '중복된 이메일입니다.' }, { status: 409 });
    }*/

    // 이메일이 중복되지 않은 경우 회원가입 요청
    const registerResponse = await axios.post('https://gummy-dang.com//api/sign-up', { userName, password, nickname });

    if (registerResponse.data.code === 'COM-000') {
      return NextResponse.json({ code: 'COM-000' });
    } else {
      return NextResponse.json({ code: 'MEM-000' }, { status: 409 });
    }
  } catch (error) {
    return NextResponse.json({ code: 'SERVER_ERROR', error: error.message }, { status: 500 });
  }
}
