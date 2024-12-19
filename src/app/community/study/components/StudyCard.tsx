'use client';

import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { StudyPost } from '@/types/post';
import Image from 'next/image';
import {
  convertSubjectToKorean,
  convertDifficultyToKorean,
} from '@/utils/study';
interface StudyCardProps {
  post: StudyPost;
}

export function StudyCard({ post }: StudyCardProps) {
  const router = useRouter();

  // 텍스트 길이 제한 함수
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  // 시간에서 :00을 제거하는 함수
  const formatTime = (time: string) => {
    return time.slice(0, 5); // "HH:mm:ss" -> "HH:mm"
  };

  return (
    <div
      className="card bg-base-100 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow w-full min-w-[320px] max-w-[320px]"
      onClick={() => router.push(`/community/study/${post.id}`)}
    >
      <figure className="px-4 pt-4">
        <Image
          src={post.thumbnailImgUrl || '/default-study-thumbnail.png'}
          alt={post.title}
          width={500}
          height={300}
          className="rounded-xl h-48 w-full object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-lg mb-4">
          {truncateText(post.title, 20)}
        </h2>

        {/* 정보 뱃지 그리드 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="badge badge-lg bg-primary/30 px-4 py-3 rounded-full">
            {truncateText(convertSubjectToKorean(post.subject), 5)}
          </div>
          <div className="badge badge-lg bg-secondary/30 px-4 py-3 rounded-full">
            난이도 {truncateText(convertDifficultyToKorean(post.difficulty), 5)}
          </div>
          <div className="badge badge-lg bg-accent/30 px-4 py-3 rounded-full">
            {post.currentParticipants + 1}/{post.maxParticipants}명
          </div>
          <div className="badge badge-lg bg-info/30 px-4 py-3 rounded-full">
            {truncateText(post.dayType.join(', '), 7)}
          </div>
        </div>

        {/* 하단 시간 정보 */}
        <div className="mt-4 text-sm flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span>모집 마감일</span>
            <span>{dayjs(post.recruitmentPeriod).format('YY.MM.DD')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>스터디 기간</span>
            <span>
              {dayjs(post.startDate).format('YY.MM.DD')} ~{' '}
              {dayjs(post.endDate).format('YY.MM.DD')}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>스터디 시간</span>
            <span>
              {formatTime(post.startTime)} ~ {formatTime(post.endTime)}
            </span>
          </div>
        </div>

        {/* 상세보기 버튼 */}
        <div className="text-right mt-2">
          <span className="text-sm hover:opacity-70">상세보기 →</span>
        </div>
      </div>
    </div>
  );
}
