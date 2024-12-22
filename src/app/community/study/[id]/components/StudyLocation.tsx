'use client';

import KakaoMap from '../../components/KakaoMap';

interface StudyLocationProps {
  post: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

export default function StudyLocation({ post }: StudyLocationProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">스터디 장소</h3>
      <p className="text-base-content/80">{post.address}</p>
      <div className="h-[400px] bg-base-200 p-4 rounded-lg">
        <KakaoMap studies={[{ ...post }]} userLocation={null} />
      </div>
    </div>
  );
}
