import axios from 'axios';
import { cookies } from 'next/headers';
import MyPageView from '../components/myPageView';
// const fetchStudies = async (accessToken: string) => {
//   const response = await axios.get(
//     `${process.env.NEXT_PUBLIC_API_URL}/studies`,
//     {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     },
//   );
//   return response.data;
// };

const studies = [
  { id: '1', name: '알고리즘 스터디' },
  { id: '2', name: '웹 개발 스터디' },
];

const MyPage = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return (
      <div>
        <h1>로그인이 필요합니다.</h1>
        <a href="/signin" className="btn btn-primary">
          로그인하러 가기
        </a>
      </div>
    );
  }

  try {
    // const studies = await fetchStudies(accessToken);
    return <MyPageView studies={studies} />;
  } catch (error) {
    console.error('내가 속한 스터디 목록 가져오기 실패');
    return (
      <>
        <h1>데이터 로딩 실패</h1>
        <p>잠시 후 다시 시도해주세요.</p>
      </>
    );
  }
};

export default MyPage;
