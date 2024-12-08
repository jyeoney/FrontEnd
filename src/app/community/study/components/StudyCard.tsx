'use client';

import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { StudyPost } from '@/types/post';
import {
  SUBJECT_OPTIONS,
  DIFFICULTY_OPTIONS,
  STATUS_OPTIONS,
} from '@/types/study';

interface StudyCardProps {
  post: StudyPost;
}

export function StudyCard({ post }: StudyCardProps) {
  const router = useRouter();

  const getStatusBadgeStyle = (status: StudyPost['status']) => {
    const baseStyle =
      'absolute top-4 right-4 rounded-full px-3 py-1 text-sm font-semibold';
    switch (status) {
      case 'RECRUITING':
        return `${baseStyle} bg-success text-success-content`;
      case 'IN_PROGRESS':
        return `${baseStyle} bg-info text-info-content`;
      case 'CANCELED':
        return `${baseStyle} bg-warning text-warning-content`;
      default:
        return baseStyle;
    }
  };

  return (
    <div
      className="card bg-base-100 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
      onClick={() => router.push(`/community/study/${post.id}`)}
    >
      <div className="card-body">
        <div className={getStatusBadgeStyle(post.status)}>
          {STATUS_OPTIONS[post.status]}
        </div>
        <h2 className="card-title">{post.title}</h2>
        <div className="flex flex-wrap gap-2 my-2">
          <span className="badge badge-outline">
            {SUBJECT_OPTIONS[post.subject]}
          </span>
          <span className="badge badge-outline">
            {DIFFICULTY_OPTIONS[post.difficulty]}
          </span>
        </div>
        <div className="text-sm text-base-content/70">
          <p>
            모집 기한: {dayjs(post.recruitmentEndDate).format('YY.MM.DD')}까지
          </p>
          <p>
            모집 인원: {post.currentMembers}/{post.maxMembers}명
          </p>
          <p>
            스터디 기간: {dayjs(post.studyStartDate).format('YY.MM.DD')} ~
            {dayjs(post.studyEndDate).format('YY.MM.DD')}
          </p>
        </div>
      </div>
    </div>
  );
}
