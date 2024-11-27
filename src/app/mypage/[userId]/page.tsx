'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';

const studies = [
  { id: '1', name: '알고리즘 스터디' },
  { id: '2', name: '웹 개발 스터디' },
];

const MyPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleChatRoomOpen = async (studyId: string) => {
    setIsLoading(true);

    try {
      const userId = '1';
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_SOCKET_URL}/chat-room/${studyId}/user/${userId}`,
      );
      const { chatRoomId } = response.data;
      if (chatRoomId) {
        router.push(`/chat/${chatRoomId}`);
      }
    } catch (error) {
      console.error('Failed to open chat room:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">마이페이지</h1>
      <ul className="space-y-2">
        {studies.map(study => (
          <li key={study.id} className="flex items-center justify-between">
            <span>{study.name}</span>
            <button
              onClick={() => handleChatRoomOpen(study.id)}
              className="btn btn-primary"
            >
              채팅방 열기
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyPage;
