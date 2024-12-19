import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';
import { User } from '@/types/post';

interface UseGroupChatParams {
  chatRoomId: string;
  userId: number;
}

interface ChatMessage {
  id: number;
  chatRoomId: number;
  content: string;
  createdAt: string;
  timestamp: string;
  user: User;
}

interface ChatState {
  isConnected: boolean;
  error: string | null;
}

const fetchChatMessages = async ({
  pageParam,
  chatRoomId,
  signal,
}: {
  pageParam: number;
  chatRoomId: string;
  signal: AbortSignal;
}): Promise<{
  messages: ChatMessage[];
  page: number;
  hasNextPage: boolean;
}> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_ROUTE_URL}/chat/${chatRoomId}/messages`,
      {
        params: { page: pageParam },
        signal,
      },
    );
    const { content, pageable, last } = response.data;

    const hasMorePages = pageParam === 0 ? false : !last;
    return {
      messages: content.map((msg: ChatMessage) => ({
        ...msg,
        timestamp: msg.createdAt, // createdAt 필드를 timestamp로 매핑
      })),
      page: pageable.pageNumber,
      hasNextPage: hasMorePages, // last 필드를 hasNextPage로 사용
    };
  } catch (error) {
    console.error('이전 메시지를 로드하는 데 실패했습니다.', error);

    return {
      messages: [], // 빈 배열 반환
      page: pageParam, // 현재 페이지 반환
      hasNextPage: false, // 더 이상 페이지가 없다고 표시
    };
  }
};

export const useGroupChat = ({ chatRoomId, userId }: UseGroupChatParams) => {
  const {
    data: fetchedData,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['chatMessages', chatRoomId], // queryKey를 객체 형태로 제공
    queryFn: async ({
      pageParam = 0,
      signal,
    }: {
      pageParam: number;
      signal: AbortSignal;
    }) => fetchChatMessages({ pageParam, chatRoomId, signal }),
    getNextPageParam: (lastPage: any, allPages: any) =>
      // lastPage.hasNextPage ? lastPage.page + 1 : undefined,
      {
        if (allPages.length === 1 && lastPage.hasNextPage) {
          return 1;
        }

        // 더 이상 로드할 페이지가 없으면 undefined 반환
        return lastPage.hasNextPage ? lastPage.page + 1 : undefined;
      },

    initialPageParam: 0,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
    maxPages: 1,
    enabled: true, // 초기 자동 로드 방지
  });

  console.log('isFetchingNextPage: ', isFetchingNextPage);

  const loadInitialMessages = useCallback(async () => {
    try {
      await fetchNextPage();
    } catch (error) {
      console.error('Initial messages load failed:', error);
    }
  }, [fetchNextPage]);

  useEffect(() => {
    // 초기 메시지 로드
    loadInitialMessages();
  }, [loadInitialMessages]);

  useEffect(() => {
    if (fetchedData) {
      const allMessages = fetchedData.pages.flatMap(page => page.messages);
      setMessages(prevMessages => {
        // 중복 제거 및 정렬
        const uniqueMessages = Array.from(
          new Map(
            [...prevMessages, ...allMessages].map(m => [m.id, m]),
          ).values(),
        ).sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        );

        console.log('Updated messages:', uniqueMessages);
        return uniqueMessages;
      });
    }
  }, [fetchedData]);

  const stompClient = useRef<Client | null>(null); // stompClient는 STOMP 클라이언트를 생성한 후, WebSocket 연결을 관리
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatState, setChatState] = useState<ChatState>({
    isConnected: false, // 현재 연결 상태
    error: null, // 에러 발생 시 에러 정보 저장
  });

  const isConnecting = useRef(false);

  // const messagesWithoutDuplicates = useMemo(() => {
  //   // 중복 제거 및 정렬 로직
  //   return Array.from(new Map(messages.map(m => [m.id, m])).values()).sort(
  //     (a, b) =>
  //       new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  //   );
  // }, [messages]);
  const messagesWithoutDuplicates = useMemo(() => {
    return Array.from(new Map(messages.map(m => [m.id, m])).values()).sort(
      (a, b) =>
        // 오래된 메시지가 앞으로 오도록 역순 정렬
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );
  }, [messages]);

  const connect = useCallback(async () => {
    console.log('connect 함수 호출됨', {
      time: new Date().toISOString(),
      stompClientExists: !!stompClient.current,
      chatRoomId,
    });

    if (isConnecting.current || stompClient.current?.connected) {
      console.log('연결 중복 방지 조건 확인', {
        isConnecting: isConnecting.current,
        isAlreadyConnected: stompClient.current?.connected,
      });
      return;
    }

    isConnecting.current = true;
    setChatState(prev => ({ ...prev, error: null }));

    try {
      const socket = new SockJS(
        `${process.env.NEXT_PUBLIC_CHAT_SOCKET_URL}/ws` as string,
      );
      console.log('SockJS 생성 완료', {
        socketState: socket.readyState, // 0: connecting, 1: open, 2: closing, 3: closed
      });

      await new Promise<void>((resolve, reject) => {
        const client = new Client({
          webSocketFactory: () => socket, // SockJS를 사용하여 WebSocket 연결 생성
          reconnectDelay: 5000, // SockJS를 사용하여 WebSocket 연결 생성
          heartbeatIncoming: 4000, // SockJS를 사용하여 WebSocket 연결 생성
          heartbeatOutgoing: 4000, // SockJS를 사용하여 WebSocket 연결 생성

          debug: msg => {
            console.log('STOMP Debug:', msg);
          },

          onConnect: () => {
            console.log('onConnect 실행', {
              time: new Date().toISOString(),
              socketState: socket.readyState,
              clientConnected: client.connected,
            });

            try {
              client.subscribe(`/topic/chat/${chatRoomId}`, messageOutput => {
                console.log('WebSocket 메시지 수신:', messageOutput.body);

                const newMessage = JSON.parse(
                  messageOutput.body,
                ) as ChatMessage;

                // timestamp 필드 보장
                newMessage.timestamp = newMessage.createdAt;

                setMessages(prevMessages => {
                  // 중복 체크 로직 유지
                  const isDuplicate = prevMessages.some(
                    msg => msg.id === newMessage.id,
                  );
                  if (isDuplicate) return prevMessages;

                  const updatedMessages = [...prevMessages, newMessage].sort(
                    (a, b) =>
                      new Date(a.timestamp).getTime() -
                      new Date(b.timestamp).getTime(),
                  );

                  console.log('메시지 상태 업데이트:', updatedMessages);
                  return updatedMessages;
                });
              });
            } catch (error) {
              console.error('구독 실패:', error);
            }

            setChatState({
              isConnected: true,
              error: null,
            });
            isConnecting.current = false;
            resolve();
          },

          onDisconnect: () => {
            console.log('WebSocket 연결 해제됨');
            setChatState(prev => ({ ...prev, isConnected: false }));
          },

          onStompError: frame => {
            console.error('STOMP 에러 발생:', {
              headers: frame.headers,
              body: frame.body,
              command: frame.command,
            });

            reject(
              new Error(frame.headers.message || '연결 오류가 발생했습니다.'),
            );
          },
        });

        stompClient.current = client;
        console.log('client.activate() 호출 전');
        client.activate(); // 웹소켓 연결이 시작됨 -> 연결이 성공하면 onConnect 콜백이 실행됨
        console.log('client.activate() 호출 후');
      });
    } catch (error) {
      console.log('연결 실패', {
        error,
        time: new Date().toISOString(),
      });

      setChatState(prev => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : '알 수 없는 오류가 발생했습니다.',
      }));
      isConnecting.current = false;
      throw error;
    }
  }, [chatRoomId]);

  // 이전 메시지 로드 함수
  // const loadPreviousMessages = useCallback(async () => {
  //   const size = 20;
  //   try {
  //     const response = await axios.get(
  //       `${process.env.NEXT_PUBLIC_CHAT_SOCKET_URL}/chat/${chatRoomId}/messages`,
  //       {
  //         params: { page, size },
  //       },
  //     );
  //     const previousMessages: ChatMessage[] = response.data.messages.map(
  //       (msg: any) => ({
  //         messageId: msg.id,
  //         chatRoomId: msg.chatRoomId,
  //         content: msg.content,
  //         timestamp: new Date(msg.createdAt).toLocaleTimeString('ko-KR', {
  //           hour: '2-digit',
  //           minute: '2-digit',
  //         }),
  //         user: {
  //           id: msg.user.id,
  //           email: msg.userEmail,
  //           profileImageUrl: msg.userProfileImageUrl,
  //           isActive: msg.isActive,
  //           createdAt: msg.createdAt,
  //           updatedAt: msg.updatedAt,
  //           nickname: msg.nickname || '알 수 없는 사용자',
  //         },
  //       }),
  //     );
  //     console.log('Previous messages:', previousMessages);
  //     setMessages(prev => [...previousMessages, ...prev]);
  //     // setMessages(previousMessages);

  //     if (previousMessages.length < size) {
  //       setHasMore(false);
  //     }

  //     setPage(prevPage => prevPage + 1);
  //   } catch (error) {
  //     console.error('이전 메시지 로드 실패:', error);
  //   }
  // }, [chatRoomId, page, hasMore]);

  // 메시지 전송 함수 (서버로 메시지를 보내는 역할)
  const sendMessage = async (content: string, file?: File) => {
    if (!chatState.isConnected) {
      console.error('연결이 되어있지 않습니다.');
      return;
    }

    let imgUrl: string | undefined;
    // 파일 업로드 처리
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('/photo', formData, {
          headers: {
            // Authorization: 'Bearer' + token.current,
            'Content-Type': 'multipart/form-data',
          },
        });

        imgUrl = response.data;
        // 응답 상태 확인
      } catch (error) {
        console.error('File upload failed:', error);
        throw error; // 에러를 상위로 전파
      }
    }

    if (content || imgUrl) {
      const messagePayload = {
        senderId: userId,
        content,
      };

      try {
        stompClient.current?.publish({
          destination: `/app/chat/${chatRoomId}/send-messages`,
          body: JSON.stringify(messagePayload),
        });
        console.log('Message sent:', messagePayload);
      } catch (error) {
        console.error('WebSocket 메시지 전송에 실패했습니다:', error);
        throw error;
      }
    }
  };

  useEffect(() => {
    console.log('useEffect 트리거', {
      chatRoomId,
      isConnected: stompClient.current?.connected,
      hasNextPage,
      isFetchingNextPage,
    });

    const initChat = async () => {
      try {
        console.log('initChat 시작');

        // 연결 상태 명시적 확인
        if (!stompClient.current?.connected) {
          console.log('연결 시도');
          await connect();
        }

        // 페이지 로드 조건 명시적 확인
        // if (!isFetchingNextPage && hasNextPage) {
        //   console.log('이전 메시지 로드 시도');
        //   await fetchNextPage();
        // }
      } catch (error) {
        console.error('초기화 중 오류:', error);
      }
    };

    initChat();
  }, [chatRoomId, connect, fetchNextPage, hasNextPage, isFetchingNextPage]);

  return {
    messages: messagesWithoutDuplicates,
    chatState,
    sendMessage,
    connect,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  };
};
