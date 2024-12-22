import { Suspense } from 'react';
import VideoRoomComponent from '@/app/studyroom/components/VideoRoomComponents';

export default function StudyRoomPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <VideoRoomComponent />
    </Suspense>
  );
}
