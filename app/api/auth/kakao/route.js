import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const urlParams = new URLSearchParams(req.url.split('?')[1]);
  const code = urlParams.get('code');

  try {
    const response = await axios.post('https://kauth.kakao.com/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        client_id: 'YOUR_KAKAO_CLIENT_ID',//.env 이용한 환경변수 처리
        redirect_uri: 'YOUR_REDIRECT_URI',
        code: code,
      },
    });

    const accessToken = response.data.access_token;
    const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const { email, id, properties } = userResponse.data.kakao_account;

    // 백엔드에서 유저 정보 저장 및 토큰 발행 로직
    const jwtToken = generateJWT({ email, id });

    return NextResponse.json({ code: 'COM-000', token: jwtToken });
  } catch (error) {
    return NextResponse.json({ code: 'AUTH-ERROR', error: error.message }, { status: 500 });
  }
}