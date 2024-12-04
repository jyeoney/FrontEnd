import axios from 'axios';
// import { cookies } from 'next/headers';

export const reissueAccessToken = async (email: string) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/mock/auth/refresh`,
      { email },
    );

    if (response.status === 200) {
      const { accessToken } = response.data;
      return accessToken;
    } else {
      throw new Error('액세스 토큰 재발급 실패');
    }
  } catch (error) {
    console.error('액세스 토큰 재발급 실패:', error);
    throw new Error('엑세스 토큰 재발급 실패');
  }
};

// export const getAccessToken = async () => {
//   const cookieStore = await cookies();
//   const accessToken = cookieStore.get('accessToken')?.value;

//   if (!accessToken) {
//     throw new Error('Access token is missing');
//   }

//   return accessToken;
// };
