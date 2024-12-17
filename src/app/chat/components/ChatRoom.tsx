'use client';

import { useGroupChat } from '@/hooks/useGroupChat';
import MessageInput from './MessageInput';
import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useSearchParams } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
interface ChatRoomProps {
  chatRoomId: string;
  studyId: string;
}

const ChatRoom = ({ chatRoomId, studyId }: ChatRoomProps) => {
  const searchParams = useSearchParams();
  const studyName = searchParams.get('studyName');
  console.log('studyId: ', studyId, 'studyName: ', studyName);

  // console.log('studyName:', studyName);
  // console.log('chatRoomId:', chatRoomId);
  // console.log('studyId:', studyId);

  const { userInfo } = useAuthStore();
  const userId = userInfo?.id || 111;
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isConnecting = useRef(false);

  const [loadError, setLoadError] = useState<string | null>(null);

  const {
    messages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    sendMessage,
    chatState,
    connect,
  } = useGroupChat({ chatRoomId, userId });

  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const handleFetchPreviousMessages = async () => {
    if (!hasNextPage || isFetchingNextPage || !chatContainerRef.current) return;

    try {
      const previousScrollHeight = chatContainerRef.current.scrollHeight;
      const previousScrollTop = chatContainerRef.current.scrollTop;

      await fetchNextPage();

      // 스크롤 위치 조정 - 새로운 메시지 로드 후 스크롤 유지
      if (chatContainerRef.current) {
        const newScrollHeight = chatContainerRef.current.scrollHeight;
        chatContainerRef.current.scrollTop =
          newScrollHeight - previousScrollHeight + previousScrollTop;
      }
    } catch (error) {
      console.error('이전 메시지 로드 실패:', error);
      setLoadError('이전 메시지를 가져오는 데 실패했습니다.');
    }
  };
  useEffect(() => {
    console.log('메시지 변경 감지:', messages);
  }, [messages]);

  useEffect(() => {
    const shouldLoadMore =
      inView && hasNextPage && !isFetchingNextPage && !loadError;

    console.log('Load previous messages conditions:', {
      inView,
      hasNextPage,
      isFetchingNextPage,
      loadError,
      shouldLoadMore,
    });

    if (shouldLoadMore) {
      handleFetchPreviousMessages();
    }
  }, [inView, hasNextPage, isFetchingNextPage, loadError]);

  // // 스크롤 맨 아래로 이동
  // useEffect(() => {
  //   if (chatContainerRef.current) {
  //     chatContainerRef.current.scrollTop =
  //       chatContainerRef.current.scrollHeight;
  //   }
  // }, [messages]);
  useEffect(() => {
    if (messages.length && chatContainerRef.current) {
      // 메시지가 추가될 때 스크롤 유지
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
          disabled={isConnecting.current}
          className="btn btn-primary"
        >
          {isConnecting.current ? '연결 중...' : '채빙방 재연결'}
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
        {isFetchingNextPage && (
          <div className="text-center text-gray-500 py-2">
            이전 메시지 로딩 중...
          </div>
        )}
        {loadError && !isFetchingNextPage && (
          <div className="text-center text-red-500">{loadError}</div>
        )}

        {messages.length === 0 && !isFetchingNextPage && (
          <div className="text-center text-gray-500">메시지가 없습니다.</div>
        )}

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
                  msg.user.id === userId ? 'justify-end' : 'justify-start'
                }`}
              >
                {/* 상대방 프로필 이미지 및 유저 ID */}
                {msg.user.id !== userId && (
                  <div className="flex flex-col items-center">
                    <img
                      src={
                        msg.user.profileImageUrl ||
                        'http://via.placeholder.com/150'
                      }
                      alt={`${msg.user.id}'s profile`}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="text-xs text-gray-600">{msg.user.id}</div>
                  </div>
                )}

                {/* 메시지 말풍선 */}
                <div
                  className={`relative max-w-[70%] px-4 py-2 rounded-lg ${
                    msg.user.id === userId
                      ? 'bg-blue-500 text-white self-end'
                      : 'bg-gray-200 text-black'
                  }`}
                >
                  <div>{msg.content}</div>
                  <div
                    className={`mt-2 text-xs ${
                      msg.user.id === userId ? 'text-gray-300' : 'text-gray-500'
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
                      msg.user.id === userId
                        ? 'border-blue-500 right-[-6px] border-r-[10px] border-r-transparent'
                        : 'border-gray-200 left-[-6px] border-l-[10px] border-l-transparent'
                    }`}
                  />
                </div>

                {/* 자신의 프로필 이미지 및 유저 ID */}
                {msg.user.id === userId && (
                  <div className="flex flex-col items-center">
                    <img
                      src={
                        msg.user.profileImageUrl ||
                        'http://via.placeholder.com/150'
                      }
                      alt="My profile"
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="text-xs text-gray-600">{msg.user.id}</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {/* 스크롤이 최상단에 도달하면 트리거 됨 */}
        {hasNextPage && !isFetchingNextPage && (
          <div ref={ref} className="h-1"></div>
        )}
      </div>

      {/* 메시지 입력 */}
      <MessageInput onSendMessage={sendMessage} />
    </div>
  );
};

export default ChatRoom;
