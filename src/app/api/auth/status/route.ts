import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import axios from 'axios';

export const GET = async (req: Request) => {
  const cookies = req.headers.get('cookie');

  const accessToken = cookies?.match(/accessToken=([^;]+)/)?.[1];
  if (!accessToken) {
    return NextResponse.json({ isSignedIn: false }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!);

    const response = await axios.get(
      `${process.env.API_BASE_URL}/auth/status`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return NextResponse.json({
      isSignedIn: true,
      user: response.data.user,
    });
  } catch (error) {
    return NextResponse.json({ isSignedIn: false }, { status: 401 });
  }
};
