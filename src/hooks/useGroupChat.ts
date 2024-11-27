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

  // const convertToKST = (timestamp: string) => {
  //   const date = new Date(timestamp);
  //   return date.toLocaleString('ko-KR', {
  //     timeZone: 'Asia/Seoul',
  //     hour12: false,
  //   });
  // };

  const connect = useCallback(async () => {
    // 연결 중 중복 요청 방지
    if (isConnecting.current || stompClient.current?.connected) {
      return;
    }
    console.log(`Connecting to chat room: ${chatRoomId}`);

    isConnecting.current = true;
    setChatState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const socket = new SockJS(
        `${process.env.NEXT_PUBLIC_BACKEND_SOCKET_URL}/ws` as string,
      );
      console.log('웹 소켓 연결까지 성공');

      const client = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000, // 연결 끊김 시 5초 후 재연결 시도
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000, // 서버-클라이언트 간 생존 신호 주기

        onConnect: () => {
          console.log('웹소켓 Connected:', stompClient.current?.connected);

          client.subscribe(`/topic/chat/${chatRoomId}`, messageOutput => {
            const newMessage = JSON.parse(messageOutput.body) as ChatMessage; // 서버로부터 받은 메시지 처리
            setMessages(prev => [...prev, newMessage]); // 메시지 배열에 추가
          });

          setChatState({
            isConnected: true,
            isConnecting: false,
            error: null,
          });
          isConnecting.current = false; // 연결 완료 상태로 변경
        },

        onStompError: frame => {
          console.error('STOMP 연결 오류:', frame);
          setChatState(prev => ({
            ...prev,
            isConnected: false,
            error: frame.headers.message || '연결 오류가 발생했습니다.',
          }));
          isConnecting.current = false; // 연결 상태 초기화
        },
      });

      stompClient.current = client;
      client.activate();
    } catch (error) {
      setChatState(prev => ({
        ...prev,
        isConnecting: false,
        error:
          error instanceof Error
            ? error.message
            : '알 수 없는 오류가 발생했습니다.',
      }));
      isConnecting.current = false; // 연결 상태 초기화
    }
  }, [chatRoomId]);

  // 기존 메시지 로드 함수
  const loadPreviousMessages = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_SOCKET_URL}/chat-room/${chatRoomId}/messages`,
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
    // if (!stompClient.current?.connected || !stompClient.current.connected) {
    //   console.error('WebSocket이 연결되지 않았습니다.');
    //   return;
    // }

    let imgUrl: string | undefined;
    // 파일 업로드 처리
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/photo', {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + token.current,
          },
          body: formData,
        });
        // 응답 상태 확인
        if (!response.ok) {
          throw new Error('파일 업로드에 실패했습니다.');
        }

        imgUrl = await response.text();
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
          destination: `/app/chat/${chatRoomId}/sendMessage`,
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
    // if (!isConnecting.current || !stompClient.current?.connected) {
    //   connect();
    //   console.log('이거 보여요?');
    // }
    // loadPreviousMessages();
    connect();
    loadPreviousMessages();

    return () => {
      stompClient.current?.deactivate(); // 컴포넌트 언마운트 시 연결 해제
    };
  }, [chatRoomId, connect, loadPreviousMessages]);

  return {
    messages,
    chatState,
    sendMessage,
    connect,
  };
};
