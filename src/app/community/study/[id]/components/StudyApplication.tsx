'use client';

import { StudyPost } from '@/types/study';
import { Application } from '@/types/application';
import { useAuthStore } from '@/store/authStore';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';

export function StudyApplication({
  study,
  isAuthor,
  setStudy,
}: {
  study: StudyPost;
  isAuthor: boolean;
  setStudy: React.Dispatch<React.SetStateAction<StudyPost | null>>;
}) {
  const { userInfo, isSignedIn } = useAuthStore();
  const [applications, setApplications] = useState<Application[]>([]);
  const [myApplication, setMyApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 신청 목록 조회
  useEffect(() => {
    const fetchApplications = async () => {
      if (!isSignedIn) return;

      try {
        const response = await axios.get(
          `/api/study-signup?studyPostId=${study.id}${
            isAuthor ? '' : '&status=PENDING'
          }`,
        );
        const data = response.data;

        if (isAuthor) {
          setApplications(data);
        } else {
          const myApp = data.find(
            (app: Application) => app.userId === userInfo?.id,
          );
          setMyApplication(myApp || null);
        }
      } catch (error) {
        console.error('신청 목록 조회 실패:', error);
      }
    };

    fetchApplications();
  }, [study.id, isSignedIn, isAuthor, userInfo?.id]);

  // 신청하기
  const handleApply = async () => {
    if (!isSignedIn || !userInfo) return;
    setIsLoading(true);

    try {
      const response = await axios.post('/api/study-sign-up', {
        studyPostId: study.id,
        userId: userInfo.id,
      });

      if (response.status === 200) {
        setMyApplication(response.data);
      }
    } catch (error) {
      console.error('스터디 신청 실패:', error);
      setError('스터디 신청에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // 신청 상태 변경 (수락/거절)
  const handleStatusChange = async (
    applicationId: number,
    newStatus: 'ACCEPTED' | 'REJECTED',
  ) => {
    try {
      const response = await axios.put(
        `/api/study-signup/${applicationId}?status=${newStatus}`,
      );

      if (response.status === 200) {
        setApplications(prev =>
          prev.map(app =>
            app.id === applicationId ? { ...app, status: newStatus } : app,
          ),
        );

        if (newStatus === 'ACCEPTED') {
          const acceptedApplication = applications.find(
            app => app.id === applicationId,
          );
          if (acceptedApplication) {
            await axios.post(`/api/study-posts/${study.id}/participants`, {
              participantId: acceptedApplication.userId,
            });
          }
        }
      }
    } catch (error) {
      console.error('신청 상태 변경 실패:', error);
    }
  };

  // 신청 취소 기능
  const handleCancelApplication = async (applicationId: number) => {
    try {
      const response = await axios.delete(
        `/api/study-sign-up/${applicationId}?userId=${userInfo?.id}`,
      );

      if (response.status === 200) {
        setMyApplication(null);
      }
    } catch (error) {
      console.error('신청 취소 실패:', error);
    }
  };

  // 스터디 마감 기능
  const handleCloseRecruitment = async () => {
    try {
      const response = await axios.put(`/api/study-posts/${study.id}/close`);
      if (response.status === 200) {
        // 스터디 상태 업데이트
        setStudy(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            status: 'IN_PROGRESS',
          };
        });

        // 승인된 신청자들 자동으로 참가자로 추가
        const acceptedApplications = applications.filter(
          app => app.status === 'ACCEPTED',
        );

        // 승인된 신청자들을 참가자로 추가
        await Promise.all(
          acceptedApplications.map(app =>
            axios.post(`/api/study-posts/${study.id}/participants`, {
              participantId: app.userId,
            }),
          ),
        );
      }
    } catch (error) {
      console.error('스터디 마감 실패:', error);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="alert alert-info">
        <span>스터디 신청은 로그인 후 가능합니다.</span>
      </div>
    );
  }

  if (isAuthor) {
    return (
      <div className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">신청 현황</h3>
          {study.status === 'RECRUITING' && (
            <button
              onClick={handleCloseRecruitment}
              className="btn btn-secondary"
            >
              모집 마감하기
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>닉네임</th>
                <th>신청일</th>
                <th>상태</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id}>
                  <td>{app.user.nickname}</td>
                  <td>{dayjs(app.createdAt).format('YYYY.MM.DD')}</td>
                  <td>{app.status}</td>
                  <td>
                    {app.status === 'PENDING' && (
                      <div className="space-x-2">
                        <button
                          className="btn btn-success btn-xs"
                          onClick={() => handleStatusChange(app.id, 'ACCEPTED')}
                        >
                          수락
                        </button>
                        <button
                          className="btn btn-error btn-xs"
                          onClick={() => handleStatusChange(app.id, 'REJECTED')}
                        >
                          거절
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (myApplication) {
    return (
      <div className="alert">
        <div className="flex justify-between items-center w-full">
          <span>
            신청 상태: {myApplication.status === 'PENDING' && '검토 중'}
            {myApplication.status === 'ACCEPTED' && '수락됨'}
            {myApplication.status === 'REJECTED' && '거절됨'}
          </span>
          {myApplication.status === 'PENDING' && (
            <button
              onClick={() => handleCancelApplication(myApplication.id)}
              className="btn btn-error btn-sm"
            >
              신청 취소
            </button>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <button
      className="btn btn-primary w-full mt-4"
      onClick={handleApply}
      disabled={isLoading}
    >
      {isLoading ? '신청 중...' : '스터디 신청하기'}
    </button>
  );
}
