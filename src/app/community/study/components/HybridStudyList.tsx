'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { StudyResponse, BaseStudyPost } from '@/types/study';
import { StudyFilter } from './StudyFilter';
import { StudyCard } from './StudyCard';
import KakaoMap from './KakaoMap';

type FilterType = 'subjects' | 'status' | 'difficulty' | 'dayType';

export default function HybridStudyList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // URL에서 상태 읽기
  const page = Number(searchParams.get('page')) || 0;
  const selectedSubjects = searchParams.getAll('subjects');
  const selectedStatus = searchParams.getAll('status');
  const selectedDifficulty = searchParams.getAll('difficulty');
  const selectedDays = searchParams.getAll('dayType');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        error => {
          console.error('위치 정보 오류:', error);
          setUserLocation({
            latitude: 37.5665,
            longitude: 126.978,
          });
        },
      );
    }
  }, []);

  const { data: posts, isLoading } = useQuery<StudyResponse>({
    queryKey: [
      'studies',
      'hybrid',
      {
        page,
        selectedSubjects,
        selectedStatus,
        selectedDifficulty,
        selectedDays,
        userLocation,
      },
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        size: '12',
        meetingType: 'HYBRID',
      });

      if (userLocation) {
        params.append('latitude', userLocation.latitude.toString());
        params.append('longitude', userLocation.longitude.toString());
      }

      selectedSubjects.forEach(subject => params.append('subjects[]', subject));
      selectedStatus.forEach(status => params.append('status[]', status));
      selectedDifficulty.forEach(difficulty =>
        params.append('difficulty[]', difficulty),
      );
      selectedDays.forEach(day => params.append('dayType[]', day));

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/study-posts/search`,
        { params },
      );
      return response.data;
    },
    enabled: !!userLocation,
  });

  const handleFilterChange = (type: FilterType, value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    const currentValues = searchParams.getAll(type);

    if (currentValues.includes(value)) {
      // 값이 이미 있으면 제거
      newSearchParams.delete(type);
      currentValues
        .filter(v => v !== value)
        .forEach(v => newSearchParams.append(type, v));
    } else {
      // 값이 없으면 추가
      newSearchParams.append(type, value);
    }

    // 페이지 초기화
    newSearchParams.set('page', '0');

    router.push(`?${newSearchParams.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', newPage.toString());
    router.push(`?${newSearchParams.toString()}`);
  };

  return (
    <div className="space-y-4">
      <StudyFilter
        selectedSubjects={selectedSubjects}
        selectedStatus={selectedStatus}
        selectedDifficulty={selectedDifficulty}
        selectedDays={selectedDays}
        onFilterChange={handleFilterChange}
      />
      <div className="h-[400px] bg-base-200 p-4 rounded-lg">
        <KakaoMap
          studies={
            posts?.content?.filter(
              (
                study,
              ): study is BaseStudyPost & {
                latitude: number;
                longitude: number;
                address: string;
              } => !!study.latitude && !!study.longitude && !!study.address,
            ) || []
          }
          userLocation={userLocation}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div>로딩 중...</div>
        ) : posts?.content ? (
          posts.content.map((post: BaseStudyPost) => (
            <StudyCard key={post.id} post={post} />
          ))
        ) : (
          <div>데이터가 없습니다.</div>
        )}
      </div>

      <div className="flex justify-center mt-8">
        <div className="join">
          {Array.from({ length: posts?.totalPages || 0 }).map((_, i) => (
            <button
              key={i}
              className={`join-item btn ${page === i ? 'btn-active' : ''}`}
              onClick={() => handlePageChange(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
