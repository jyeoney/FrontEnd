'use client';

import { useGroupChat } from '@/hooks/useGroupChat';
import MessageInput from './MessageInput';
import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useSearchParams } from 'next/navigation';
interface ChatRoomProps {
  chatRoomId: string;
  studyId: string;
}

const ChatRoom = ({ chatRoomId, studyId }: ChatRoomProps) => {
  const searchParams = useSearchParams();
  const studyName = searchParams.get('studyName');
  // console.log('studyName:', studyName);
  // console.log('chatRoomId:', chatRoomId);
  // console.log('studyId:', studyId);

  const { messages, chatState, sendMessage, connect } =
    useGroupChat(chatRoomId);
  const { userInfo } = useAuthStore();
  // const userId = userInfo?.id;
  const userId = 'user1';
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 스크롤 맨 아래로 이동
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  if (chatState.error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="alert alert-error">
          <span>{chatState.error}</span>
        </div>
        <button
          onClick={connect}
          disabled={chatState.isConnecting}
          className="btn btn-primary"
        >
          {chatState.isConnecting ? '연결 중...' : '다시 연결'}
        </button>
      </div>
    );
  }
  const isDateChanged = (
    currentTimestamp: string,
    prevTimestamp: string | null,
  ) => {
    const currentDate = new Date(currentTimestamp).toDateString();
    const prevDate = prevTimestamp
      ? new Date(prevTimestamp).toDateString()
      : null;
    return currentDate !== prevDate;
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg p-4 shadow-md">
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto space-y-4 pb-4"
      >
        {messages.map((msg, idx) => {
          const prevMessage = messages[idx - 1] || null;
          const showDate =
            !prevMessage ||
            isDateChanged(msg.timestamp, prevMessage?.timestamp);

          return (
            <div key={msg.timestamp || idx}>
              {/* 날짜 구분 라인 */}
              {showDate && (
                <div className="text-center text-gray-500 text-xs my-2">
                  {new Date(msg.timestamp).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              )}

              {/* 채팅 메시지 */}
              <div
                className={`flex items-end gap-2 ${
                  msg.sender === userId ? 'justify-end' : 'justify-start'
                }`}
              >
                {/* 상대방 프로필 이미지 및 유저 ID */}
                {msg.sender !== userId && (
                  <div className="flex flex-col items-center">
                    <img
                      src={msg.profileImg || 'http://via.placeholder.com/150'}
                      alt={`${msg.sender}'s profile`}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="text-xs text-gray-600">{msg.sender}</div>
                  </div>
                )}

                {/* 메시지 말풍선 */}
                <div
                  className={`relative max-w-[70%] px-4 py-2 rounded-lg ${
                    msg.sender === userId
                      ? 'bg-blue-500 text-white self-end'
                      : 'bg-gray-200 text-black'
                  }`}
                >
                  <div>{msg.content}</div>
                  <div
                    className={`mt-2 text-xs ${
                      msg.sender === userId ? 'text-gray-300' : 'text-gray-500'
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  {/* {msg.imgUrl && (
                    <img
                      src={msg.imgUrl}
                      alt="첨부 이미지"
                      className="mt-2 rounded-lg max-w-[200px]"
                    />
                  )} */}

                  {/* 말풍선 꼬리 */}
                  <div
                    className={`absolute bottom-0 w-0 h-0 border-t-[10px] ${
                      msg.sender === userId
                        ? 'border-blue-500 right-[-6px] border-r-[10px] border-r-transparent'
                        : 'border-gray-200 left-[-6px] border-l-[10px] border-l-transparent'
                    }`}
                  />
                </div>

                {/* 자신의 프로필 이미지 및 유저 ID */}
                {msg.sender === userId && (
                  <div className="flex flex-col items-center">
                    <img
                      src={msg.profileImg || 'http://via.placeholder.com/150'}
                      alt="My profile"
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="text-xs text-gray-600">{msg.sender}</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 메시지 입력 */}
      <MessageInput onSendMessage={sendMessage} />
    </div>
  );
};

export default ChatRoom;
