// 'use client';

import ChatRoom from '@/app/chat/components/ChatRoom';

const ChatPage = async ({
  params,
}: {
  params: { chatRoomId: string; studyId: string };
}) => {
  // const validChatRoomId = chatRoomId as string;

  // useEffect(() => {
  //   if (!chatRoomId) {
  //     console.log('chatRoomId가 없습니다.');
  //   }
  // }, [chatRoomId]);

  const { chatRoomId, studyId } = await params;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">채팅</h1>

      <div className="mt-4">
        <ChatRoom chatRoomId={chatRoomId} studyId={studyId} />
        {/* <ChatRoom /> */}
      </div>
    </div>
  );
};

export default ChatPage;
