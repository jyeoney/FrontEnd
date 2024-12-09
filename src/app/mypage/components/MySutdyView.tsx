// 'use client';

// import { useRouter } from 'next/navigation';
// import { useState } from 'react';
// import axios from 'axios';
// import { useAuthStore } from '@/store/authStore';

// interface Study {
//   id: string;
//   name: string;
// }

// interface MyPageProps {
//   studies: Study[];
// }

// const MySutdyView = ({ studies }: MyPageProps) => {
//   const router = useRouter();
//   const [, setIsLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState('study');

//   const handleChatRoomOpen = async (studyId: string) => {
//     setIsLoading(true);

//     const { userInfo } = useAuthStore();

//     try {
//       const userId = userInfo?.id;
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_BACKEND_SOCKET_URL}/chat-room/${studyId}/user/${userId}`,
//       );
//       const { chatRoomId } = response.data;
//       if (chatRoomId) {
//         router.push(`/chat/${chatRoomId}`);
//       }
//     } catch (error) {
//       console.error('Failed to open chat room:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 space-y-4">
//       <h1 className="text-2xl font-bold">마이페이지</h1>
//       <ul className="space-y-2">
//         {studies.map(study => (
//           <li key={study.id} className="flex items-center justify-between">
//             <span>{study.name}</span>
//             <button
//               onClick={() => handleChatRoomOpen(study.id)}
//               className="btn btn-primary"
//             >
//               채팅방 열기
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default MySutdyView;

'use client';

import { useState } from 'react';

interface Study {
  id: string;
  name: string;
}

interface MyPageProps {
  studies: Study[];
}

const MyStudyView = ({ studies }: MyPageProps) => {
  const [activeTab, setActiveTab] = useState('study'); // 기본값을 'study'

  // 탭 클릭 시 해당 탭의 내용을 보여주는 함수
  const renderTabContent = () => {
    switch (activeTab) {
      case 'study':
        return (
          <ul className="space-y-2">
            {studies.length === 0 ? (
              <p>스터디 목록이 없습니다.</p>
            ) : (
              studies.map(study => (
                <li
                  key={study.id}
                  className="flex items-center justify-between border-b border-gray-200 pb-2"
                >
                  <span>{study.name}</span>
                  <div className="flex space-x-2">
                    <button className="btn btn-primary btn-sm">채팅</button>
                    <button className="btn btn-accent btn-sm">스터디룸</button>
                  </div>
                </li>
              ))
            )}
          </ul>
        );
      case 'info':
        return <p>나의 정보공유 탭 내용</p>;
      case 'qna':
        return <p>나의 Q&A 탭 내용</p>;
      case 'recruitment':
        return <p>나의 스터디 모집글 탭 내용</p>;
      default:
        return <p>기타 탭에 대한 내용</p>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* DaisyUI 탭 구조 - 접근성 향상 */}
      <div role="tablist" className="tabs tabs-lifted">
        {/* 첫 번째 탭 */}
        <input
          type="radio"
          name="my_tabs"
          id="tab-study"
          className="hidden"
          checked={activeTab === 'study'}
          onChange={() => setActiveTab('study')}
        />
        <label
          htmlFor="tab-study"
          className={`tab tab-lg ${
            activeTab === 'study' ? 'tab-active shadow-lg font-bold' : ''
          }`}
        >
          내가 속한 스터디
        </label>

        {/* 두 번째 탭 */}
        <input
          type="radio"
          name="my_tabs"
          id="tab-info"
          className="hidden"
          checked={activeTab === 'info'}
          onChange={() => setActiveTab('info')}
        />
        <label
          htmlFor="tab-info"
          className={`tab tab-lg ${
            activeTab === 'info' ? 'tab-active shadow-lg font-bold' : ''
          }`}
        >
          나의 정보 공유
        </label>

        {/* 세 번째 탭 */}
        <input
          type="radio"
          name="my_tabs"
          id="tab-qna"
          className="hidden"
          checked={activeTab === 'qna'}
          onChange={() => setActiveTab('qna')}
        />
        <label
          htmlFor="tab-qna"
          className={`tab tab-lg ${
            activeTab === 'qna' ? 'tab-active shadow-lg font-bold' : ''
          }`}
        >
          나의 Q&A
        </label>

        {/* 네 번째 탭 */}
        <input
          type="radio"
          name="my_tabs"
          id="tab-recruitment"
          className="hidden"
          checked={activeTab === 'recruitment'}
          onChange={() => setActiveTab('recruitment')}
        />
        <label
          htmlFor="tab-recruitment"
          className={`tab tab-lg ${
            activeTab === 'recruitment' ? 'tab-active shadow-lg font-bold' : ''
          }`}
        >
          나의 스터디 모집글
        </label>
      </div>

      {/* 탭 내용 */}
      <div className="p-4 bg-base-200 rounded-lg shadow-md border-t-4 border-primary">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default MyStudyView;
