import { Suspense } from 'react';
import InfoList from '@/app/community/components/InfoList';

export default function InfoListPage() {
  return (
    <div className="space-y-4">
      <Suspense fallback={<div>로딩 중...</div>}>
        <InfoList />
      </Suspense>
    </div>
  );
}
