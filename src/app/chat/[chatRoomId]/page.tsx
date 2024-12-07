'use client';

import ChatRoom from '@/app/chat/components/ChatRoom';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

const ChatPage = () => {
  const { chatRoomId } = useParams();
  const validChatRoomId = chatRoomId as string;

  useEffect(() => {
    if (!chatRoomId) {
      console.log('chatRoomId가 없습니다.');
    }
  }, [chatRoomId]);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">채팅</h1>

      <div className="mt-4">
        <ChatRoom chatRoomId={validChatRoomId} />
      </div>
    </div>
  );
};

export default ChatPage;
