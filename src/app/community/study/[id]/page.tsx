'use client';

import { useEffect, useState } from 'react';
import { StudyPost } from '@/types/post';
import {
  SUBJECT_OPTIONS,
  DIFFICULTY_OPTIONS,
  STATUS_OPTIONS,
  MEETING_TYPE,
} from '@/types/study';
import dayjs from 'dayjs';

export default function StudyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [study, setStudy] = useState<StudyPost | null>(null);

  useEffect(() => {
    const fetchStudy = async () => {
      try {
        const response = await fetch(`/api/study-posts/${params.id}`);
        const data = await response.json();
        setStudy(data);
      } catch (error) {
        console.error('스터디 정보 조회 실패:', error);
      }
    };

    fetchStudy();
  }, [params.id]);

  if (!study) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-base-100 shadow-xl rounded-lg p-6">
        {/* 스터디 기본 정보 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">{study.title}</h1>
          <div className="flex gap-2 mb-4">
            <span className="badge badge-primary">
              {SUBJECT_OPTIONS[study.subject]}
            </span>
            <span className="badge badge-secondary">
              {DIFFICULTY_OPTIONS[study.difficulty]}
            </span>
            <span className="badge">{STATUS_OPTIONS[study.status]}</span>
            <span className="badge">{MEETING_TYPE[study.meeting_type]}</span>
          </div>
          <div className="space-y-2 text-sm">
            <p>
              모집 기한: {dayjs(study.recruitmentEndDate).format('YYYY.MM.DD')}
              까지
            </p>
            <p>
              모집 인원: {study.currentMembers}/{study.maxMembers}명
            </p>
            <p>
              스터디 기간: {dayjs(study.studyStartDate).format('YYYY.MM.DD')} ~
              {dayjs(study.studyEndDate).format('YYYY.MM.DD')}
            </p>
          </div>
        </div>

        {/* 스터디 상세 내용 */}
        <div className="prose max-w-none mb-8">
          <div dangerouslySetInnerHTML={{ __html: study.content }} />
        </div>

        {/* 로그인 기능 구현 전까지는 메시지만 표시 */}
        <div className="alert alert-info">
          <span>로그인 기능 구현 후 신청 기능이 추가될 예정입니다.</span>
        </div>
      </div>
    </div>
  );
}
