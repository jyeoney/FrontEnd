'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import dayjs from 'dayjs';
import LocationSearch from './LocationSearch';
import {
  SUBJECT_OPTIONS,
  DIFFICULTY_OPTIONS,
  DAY_KOREAN,
  BaseStudyPost,
} from '@/types/study';
import { Location } from '@/types/location';

interface HybridFormProps {
  initialData?: BaseStudyPost;
  isEdit?: boolean;
}

export default function HybridForm({ initialData, isEdit }: HybridFormProps) {
  const router = useRouter();
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');

  useEffect(() => {
    if (initialData && isEdit) {
      setSelectedDays(initialData.dayType);
      setSelectedLocation({
        latitude: initialData.latitude || 0,
        longitude: initialData.longitude || 0,
        address: initialData.address || '',
      });
      if (initialData.thumbnailImgUrl) {
        setThumbnailPreview(initialData.thumbnailImgUrl);
      }
    }
  }, [initialData, isEdit]);

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day],
    );
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const thumbnail = formData.get('thumbnail') as File;

      let thumbnailUrl = '';
      if (thumbnail && thumbnail.size > 0) {
        const imageFormData = new FormData();
        imageFormData.append('image', thumbnail);
        const response = await axios.post('/api/upload', imageFormData);
        thumbnailUrl = response.data.url;
      }

      const studyData = {
        title: formData.get('title'),
        studyName: formData.get('studyName'),
        content: formData.get('content'),
        subject: formData.get('subject'),
        difficulty: formData.get('difficulty'),
        recruitmentStartDate: dayjs().format('YYYY-MM-DD'),
        recruitmentEndDate: formData.get('recruitmentEndDate'),
        studyStartDate: formData.get('studyStartDate'),
        studyEndDate: formData.get('studyEndDate'),
        maxMembers: parseInt(formData.get('maxMembers') as string),
        startTime: formData.get('meetingStartTime') as string,
        endTime: formData.get('meetingEndTime') as string,
        status: 'RECRUITING',
        meetingType: 'HYBRID',
        dayType: selectedDays,
        latitude: selectedLocation?.latitude,
        longitude: selectedLocation?.longitude,
        address: selectedLocation?.address,
        thumbnail: thumbnailUrl || '/default-study-thumbnail.png',
      };

      if (isEdit && initialData) {
        await axios.post(`/api/study-posts/${initialData.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('스터디 글이 수정되었습니다!');
      } else {
        await axios.post('/api/study-posts', studyData);
        alert('스터디 글이 작성되었습니다!');
      }

      router.push('/community/study');
    } catch (error) {
      console.error(
        isEdit ? '스터디 글 수정 실패:' : '스터디 글 작성 실패:',
        error,
      );
      alert('스터디 글 작성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="form-control">
        <label className="label">
          <span className="label-text">썸네일 이미지</span>
        </label>
        <input
          type="file"
          name="thumbnail"
          accept="image/*"
          onChange={handleThumbnailChange}
          className="file-input file-input-bordered w-full"
        />
        {thumbnailPreview && (
          <div className="mt-2">
            <img
              src={thumbnailPreview}
              alt="썸네일 미리보기"
              className="w-full max-w-xs rounded-lg"
            />
          </div>
        )}
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">제목</span>
        </label>
        <input
          type="text"
          name="title"
          defaultValue={initialData?.title}
          required
          className="input input-bordered"
          placeholder="모집 글의 제목을 입력하세요"
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">스터디명</span>
        </label>
        <input
          type="text"
          name="studyName"
          defaultValue={initialData?.studyName}
          required
          className="input input-bordered"
          placeholder="스터디명을 입력하세요"
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">스터디 주제</span>
        </label>
        <select
          name="subject"
          required
          className="select select-bordered"
          defaultValue={initialData?.subject || ''}
        >
          <option value="">주제 선택</option>
          {Object.entries(SUBJECT_OPTIONS).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">난이도</span>
        </label>
        <select
          name="difficulty"
          required
          className="select select-bordered"
          defaultValue={initialData?.difficulty || ''}
        >
          <option value="">난이도 선택</option>
          {Object.entries(DIFFICULTY_OPTIONS).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">모집 마감일</span>
        </label>
        <input
          type="date"
          name="recruitmentPeriod"
          defaultValue={initialData?.recruitmentPeriod}
          required
          className="input input-bordered"
          min={dayjs().format('YYYY-MM-DD')}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">스터디 기간</span>
        </label>
        <div className="flex gap-2">
          <input
            type="date"
            name="studyStartDate"
            defaultValue={initialData?.startDate}
            required
            className="input input-bordered flex-1"
            min={dayjs().format('YYYY-MM-DD')}
          />
          <span className="self-center">~</span>
          <input
            type="date"
            name="studyEndDate"
            defaultValue={initialData?.endDate}
            required
            className="input input-bordered flex-1"
            min={dayjs().format('YYYY-MM-DD')}
          />
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">모집 인원</span>
        </label>
        <input
          type="number"
          name="maxMembers"
          required
          min={2}
          max={10}
          defaultValue={initialData?.maxParticipants || 2}
          step={1}
          className="input input-bordered"
          placeholder="2~10명 사이로 입력하세요"
          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
            const value = parseInt(e.target.value);
            if (value < 2) e.target.value = '2';
            if (value > 10) e.target.value = '10';
          }}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">스터디 시간</span>
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="time"
            name="meetingStartTime"
            defaultValue={initialData?.startTime}
            required
            className="input input-bordered flex-1"
          />
          <span className="text-base-content/70">~</span>
          <input
            type="time"
            name="meetingEndTime"
            defaultValue={initialData?.endTime}
            required
            className="input input-bordered flex-1"
          />
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">스터디 요일</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {Object.values(DAY_KOREAN).map(day => (
            <button
              key={day}
              type="button"
              className={`btn btn-sm ${
                selectedDays.includes(day) ? 'btn-primary' : 'btn-outline'
              }`}
              onClick={() => handleDayToggle(day)}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">오프라인 모임 장소</span>
        </label>
        <LocationSearch onLocationSelect={setSelectedLocation} />
        {selectedLocation && (
          <div className="alert alert-info mt-2">
            <span>선택된 위치: {selectedLocation.address}</span>
          </div>
        )}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">스터디 소개</span>
        </label>
        <textarea
          name="content"
          defaultValue={initialData?.description}
          required
          className="textarea textarea-bordered h-32"
          placeholder="스터디에 대해 자세히 설명해주세요"
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={isLoading || !selectedLocation}
      >
        {isLoading
          ? isEdit
            ? '수정 중...'
            : '작성 중...'
          : isEdit
            ? '수정 완료'
            : '작성 완료'}
      </button>
    </form>
  );
}
