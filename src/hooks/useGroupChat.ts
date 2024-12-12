import { useState, useRef, useCallback, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';

interface ChatMessage {
  profileImg?: string;
  chatRoomId: string;
  sender: string;
  content: string;
  timestamp: string;
  imgUrl?: string;
}

interface ChatState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

export const useGroupChat = (chatRoomId: string) => {
  const stompClient = useRef<Client | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatState, setChatState] = useState<ChatState>({
    isConnected: false, // 현재 연결 상태
    isConnecting: false, // 연결 시도 중인지 여부
    error: null, // 에러 발생 시 에러 정보 저장
  });

  const isConnecting = useRef(false);
  const token = useRef<string>('token'); // 실제 토큰 관리 로직으로 대체 필요

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
    setChatState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const socket = new SockJS(
        `${process.env.NEXT_PUBLIC_CHAT_SOCKET_URL}/ws` as string,
      );
      console.log('SockJS 생성 완료', {
        socketState: socket.readyState, // 0: connecting, 1: open, 2: closing, 3: closed
      });

      await new Promise<void>((resolve, reject) => {
        const client = new Client({
          webSocketFactory: () => socket,
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          debug: msg => {
            console.log('STOMP Debug:', msg);
          },

          onConnect: () => {
            console.log('onConnect 실행', {
              time: new Date().toISOString(),
              socketState: socket.readyState,
              clientConnected: client.connected,
            });

            client.subscribe(`/topic/chat/${chatRoomId}`, messageOutput => {
              console.log('메시지 구독 성공');
              const newMessage = JSON.parse(messageOutput.body) as ChatMessage;
              setMessages(prev => [...prev, newMessage]);
            });

            setChatState({
              isConnected: true,
              isConnecting: false,
              error: null,
            });
            isConnecting.current = false;
            resolve();
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
        client.activate();
        console.log('client.activate() 호출 후');
      });
    } catch (error) {
      console.log('연결 실패', {
        error,
        time: new Date().toISOString(),
      });
      setChatState(prev => ({
        ...prev,
        isConnecting: false,
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
  const loadPreviousMessages = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_CHAT_SOCKET_URL}/chat/${chatRoomId}/messages`,
      );
      const previousMessages = response.data;
      console.log('Previous messages:', previousMessages);
      const messagesWithUserNames = previousMessages.map((msg: any) => ({
        ...msg,
        senderName: msg.sender || '알 수 없는 유저',
        timestamp: msg.timestamp,
      }));
      setMessages(messagesWithUserNames);
    } catch (error) {
      console.error('이전 메시지 로드 실패:', error);
    }
  }, [chatRoomId]);

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
            Authorization: 'Bearer' + token.current,
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
        sender: 'user1',
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
    console.log('useEffect 실행', {
      time: new Date().toISOString(),
      chatRoomId,
      isFirstRender: stompClient.current === null,
    });

    const initChat = async () => {
      try {
        console.log('initChat 시작');
        await connect();
        console.log('connect 완료');
        await loadPreviousMessages();
        console.log('이전 메시지 로드 완료');
      } catch (error) {
        console.error('초기화 실패:', error);
      }
    };

    initChat();

    return () => {
      console.log('cleanup 실행', {
        wasConnected: stompClient.current?.connected,
      });
      if (stompClient.current?.connected) {
        stompClient.current.deactivate();
      }
    };
  }, [chatRoomId, connect, loadPreviousMessages]);

  return {
    messages,
    chatState,
    sendMessage,
    connect,
  };
};
