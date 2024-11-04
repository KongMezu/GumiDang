import axios from 'axios';
import { NextResponse } from 'next/server';

export async function post(req) {
  const { userName, password, nickname } = await req.json();

  try {
    const registerResponse = await axios.post('https://gummy-dang-server.com/sign-up', { userName, password, nickname });

    if (registerResponse.data.code === 'COM-000') {
      return NextResponse.json({ code: 'COM-000' });
    } else {
      return NextResponse.json({ code: 'MEM-000' }, { status: 409 });
    }
  } catch (error) {
    return NextResponse.json({ code: 'SERVER_ERROR', error: error.message }, { status: 500 });
  }
}
