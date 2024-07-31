import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { userName, password } = await req.json();

  try {
    const response = await axios.post('https://gummy-dang.com/api/login', { userName, password });

    if (response.data.code === 'COM-000') {
      const { data } = response.data;
      const token = response.headers['authorization'];

      const res = NextResponse.json({ code: 'COM-000', data });
      res.cookies.set('refreshToken', response.headers['set-cookie'][0], { httpOnly: true });

      if (token) {
        res.headers.set('Authorization', token);
      }

      return res;
    } else {
      return NextResponse.json({ code: 'MEM-001' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ code: 'SERVER_ERROR', error: error.message }, { status: 500 });
  }
}