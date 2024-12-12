'use client';

import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { StudyPost } from '@/types/post';
import { useAuthStore } from '@/store/authStore';

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

  // 시간에서 :00을 제거하는 함수
  const formatTime = (time: string) => {
    return time.slice(0, 5);
  };

  return (
    <div
      className="card bg-base-100 shadow-xl cursor-pointer"
      onClick={() => router.push(`/community/study/${post.studyPostId}`)}
    >
      <figure className="px-4 pt-4">
        <img
          src={post.thumbnailImgUrl || '/default-study-thumbnail.png'}
          alt={post.studyName}
          className="rounded-xl h-48 w-full object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-lg items-center">
          {post.studyName}
          {userInfo?.id === post.studyLeaderId && (
            <span className="badge badge-primary ml-2">스터디장</span>
          )}
        </h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>상태:</span>
            <span>{post.status}</span>
          </div>
          <div className="flex justify-between">
            <span>주제:</span>
            <span>{post.subject}</span>
          </div>
          <div className="flex justify-between">
            <span>난이도:</span>
            <span>{post.difficulty}</span>
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
            onClick={e => {
              e.stopPropagation();
              router.push(`/chat/chatRoomId/${post.id}`);
            }}
          >
            채팅
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={e => {
              e.stopPropagation();
              router.push(`/community/study/${post.id}`);
            }}
          >
            스터디룸
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyStudyCard;
