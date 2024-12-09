import MySutdyView from '../components/MySutdyView';
import UserInfoView from '../components/UserInfoView';
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
  try {
    // const studies = await fetchStudies(accessToken);
    return (
      <>
        <UserInfoView />
        <MySutdyView studies={studies} />
      </>
    );
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
