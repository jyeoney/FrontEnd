import { Suspense } from 'react';
import QnAList from '@/app/community/components/QnAList';

export default function QnAListPage() {
  return (
    <div className="space-y-4">
      <Suspense fallback={<div>로딩 중...</div>}>
        <QnAList />
      </Suspense>
    </div>
  );
}
