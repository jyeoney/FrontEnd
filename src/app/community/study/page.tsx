import { Suspense } from 'react';
import StudyList from '@/app/community/study/components/StudyList';

export default function StudyListPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <StudyList />
    </Suspense>
  );
}
