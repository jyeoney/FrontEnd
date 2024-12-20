'use client';

import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { useAuthStore } from '@/store/authStore';
import axios from 'axios';
import Image from 'next/image';
import { FaCrown } from 'react-icons/fa';
import {
  convertSubjectToKorean,
  convertDifficultyToKorean,
  convertStudyStatus,
} from '@/utils/study';
import CustomAlert from '@/components/common/Alert';
import { useState } from 'react';

interface MyStudyCardProps {
  post: MyStudyCardData;
}

export interface MyStudyCardData {
  id: number;
  studyName: string;
  subject: string;
  difficulty: string;
  dayType: string[]; // 요일
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  status: string;
  studyPostId: number;
  studyLeaderId: number;
  totalParticipants: number;
  thumbnailImgUrl?: string; // 썸네일 이미지 URL (optional)
}

const MyStudyCard = ({ post }: MyStudyCardProps) => {
  const router = useRouter();
  const { userInfo } = useAuthStore();

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // 시간에서 :00을 제거하는 함수
  const formatTime = (time: string) => {
    return time.slice(0, 5);
  };

  const checkStudyTime = () => {
    const now = new Date();
    const currentDay = ['일', '월', '화', '수', '목', '금', '토'][now.getDay()];
    const currentTime = now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });

    if (!post.dayType.includes(currentDay)) {
      setAlertMessage('오늘은 스터디 진행 요일이 아닙니다.');
      setShowAlert(true);
      return false;
    }

    if (currentTime < post.startTime || currentTime > post.endTime) {
      setAlertMessage('현재는 스터디 시간이 아닙니다.');
      setShowAlert(true);
      return false;
    }

    return true;
  };

  // 스터디룸 버튼의 onClick 핸들러 수정
  const handleStudyRoomClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (checkStudyTime()) {
      router.push(
        `/studyroom?studyId=${post.id}&nickname=${userInfo?.nickname}`,
      );
    }
  };

  return (
    <div
      className="card bg-base-100 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow w-full min-w-[320px] max-w-[320px]"
      onClick={() => router.push(`/community/study/${post.studyPostId}`)}
    >
      <figure className="px-4 pt-4">
        <Image
          src={post.thumbnailImgUrl || '/default-profile-image.png'}
          alt={post.studyName}
          width={500}
          height={300}
          className="rounded-xl h-48 w-full object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-lg items-center">
          {post.studyName}
          {userInfo?.id === post.studyLeaderId && (
            <div className="absolute top-4 right-4 flex flex-col items-center space-y-1 bg-rose-500 p-2 rounded-lg shadow-md">
              <FaCrown className="text-white text-2xl" />
              <span className="text-white text-xs font-bold">스터디장</span>
            </div>
          )}
        </h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>상태:</span>
            <span>{convertStudyStatus(post.status)}</span>
          </div>
          <div className="flex justify-between">
            <span>주제:</span>
            <span>{convertSubjectToKorean(post.subject)}</span>
          </div>
          <div className="flex justify-between">
            <span>난이도:</span>
            <span>{convertDifficultyToKorean(post.difficulty)}</span>
          </div>
          <div className="flex justify-between">
            <span>요일:</span>
            <span>{post.dayType?.join(', ') || '없음'}</span>
          </div>
          <div className="flex justify-between">
            <span>기간:</span>
            <span>
              {dayjs(post.startDate).format('MM.DD')} ~{' '}
              {dayjs(post.endDate).format('MM.DD')}
            </span>
          </div>
          <div className="flex justify-between">
            <span>시간:</span>
            <span>
              {formatTime(post.startTime)} ~ {formatTime(post.endTime)}
            </span>
          </div>
        </div>
        <div className="card-actions justify-end mt-4">
          <button
            className="btn btn-primary btn-sm"
            onClick={async e => {
              e.stopPropagation();
              try {
                const response = await axios.post(
                  `${process.env.NEXT_PUBLIC_API_ROUTE_URL}/chat/study/${post.id}/participant/${userInfo?.id}`,
                  {},
                  {
                    headers: { 'Content-Type': 'application/json' },
                  },
                );
                if (response.status === 200) {
                  const { chatRoomId, studyId, studyName } = response.data;
                  router.push(
                    `/chat/${chatRoomId}/study/${studyId}?studyName=${studyName}`,
                  );
                } else {
                  setAlertMessage(
                    '채팅방에 참여할 수 없습니다. 잠시 후 다시 시도해주세요.',
                  );
                  setShowAlert(true);
                }
              } catch (error) {
                console.error('채팅방 참가 중 오류 발생:', error);
                setAlertMessage(
                  '채팅방 참가 중 오류가 발생했습니다. 관리자에게 문의하세요.',
                );
                setShowAlert(true);
              }
            }}
          >
            채팅
          </button>
          <button
            className="btn btn-accent btn-sm"
            onClick={handleStudyRoomClick}
          >
            스터디룸
          </button>
        </div>
      </div>
      {showAlert && (
        <CustomAlert
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
};

export default MyStudyCard;
