'use client';

import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { StudyPost } from '@/types/post';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import MyStudyCard from './MyStudyCard';
import { MyStudyCardData } from './MyStudyCard';
import { StudyCard } from '@/app/community/study/components/StudyCard';
import MyInfoPostCard from './MyInfoPostCard';
import MyQnAPostCard from './MyQnAPostCard';
import { BasePost } from '@/types/post';

interface MyStudyProps {
  post: StudyPost;
}

const MyStudyView = () => {
  const { userInfo } = useAuthStore();
  const [activeTab, setActiveTab] = useState('myStudy'); // 기본값을 'myStudy'
  const [myStudies, setMyStudies] = useState<MyStudyCardData[]>([]);
  const [myStudyPosts, setMyStudyPosts] = useState<StudyPost[]>([]);
  const [myInfoPosts, setMyInfoPosts] = useState<BasePost[]>([]);
  const [myQnAPosts, setMyQnAPosts] = useState<BasePost[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 마이페이지가 처음 로드될 때 'myStudy' 탭 클릭 상태
    handleTabClick('myStudy');
  }, []);

  const handleMyStudyTabClick = async () => {
    try {
      if (userInfo?.id) {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_ROUTE_URL}/study/author/${userInfo?.id}`,
        );
        if (response.status === 200 && response.data) {
          setMyStudies(response.data.content);
        }
      }
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        console.log('error:' + error.response);
        const message =
          data?.errorMessage ||
          '오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        setError(message);
      } else {
        setError('내가 속한 스터디 목록을 불러오는 데 실패했습니다.');
      }
    }
    const data = {
      content: [
        {
          id: 25,
          studyName: '코테',
          subject: 'JOB_PREPARATION',
          difficulty: 'HIGH',
          dayType: ['화', '목'],
          startDate: '2024-12-04',
          endDate: '2024-12-22',
          startTime: '19:00:00',
          endTime: '21:00:00',
          meetingType: 'HYBRID',
          status: 'PENDING',
          studyPostId: 97,
          studyLeaderId: 11,
          totalParticipants: 2,
        },
        {
          id: 24,
          studyName: '코테',
          subject: 'JOB_PREPARATION',
          difficulty: 'HIGH',
          dayType: ['화', '목'],
          startDate: '2024-12-04',
          endDate: '2024-12-22',
          startTime: '19:00:00',
          endTime: '21:00:00',
          meetingType: 'HYBRID',
          status: 'PENDING',
          studyPostId: 98,
          studyLeaderId: 11,
          totalParticipants: 2,
        },
        {
          id: 23,
          studyName: '코테',
          subject: 'JOB_PREPARATION',
          difficulty: 'HIGH',
          dayType: ['화', '목'],
          startDate: '2024-12-04',
          endDate: '2024-12-22',
          startTime: '19:00:00',
          endTime: '21:00:00',
          meetingType: 'HYBRID',
          status: 'PENDING',
          studyPostId: 96,
          studyLeaderId: 11,
          totalParticipants: 2,
        },
      ],
      pageable: {
        pageNumber: 0,
        pageSize: 20,
        sort: {
          empty: true,
          sorted: false,
          unsorted: true,
        },
        offset: 0,
        paged: true,
        unpaged: false,
      },
      last: true,
      totalPages: 1,
      totalElements: 3,
      first: true,
      size: 20,
      number: 0,
      sort: {
        empty: true,
        sorted: false,
        unsorted: true,
      },
      numberOfElements: 3,
      empty: false,
    };

    // setMyStudies(data.content);
  };

  const handleMyStudyPostTabClick = async () => {
    try {
      if (userInfo?.id) {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_ROUTE_URL}/study-posts/author/${userInfo?.id}`,
          {
            headers: { 'Content-Type': 'application/json' },
          },
        );
        if (response.status === 200 && response.data) {
          setMyStudyPosts(response.data.content);
          console.log('나의 스터디 모집 글 불러오기 성공했습니다.');
        }
      }
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        console.log('error:' + error.response);
        const message =
          data?.errorMessage ||
          '오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        setError(message);
      } else {
        setError('나의 스터디 모집 글 목록을 불러오는 데 실패했습니다.');
      }
    }
  };

  const handleMyInfoPostTabClick = async () => {
    try {
      if (userInfo?.id) {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_ROUTE_URL}/info-posts/author/${userInfo?.id}`,
          {
            headers: { 'Content-Type': 'application/json' },
          },
        );
        if (response.status === 200 && response.data) {
          setMyInfoPosts(response.data.content);
          console.log('나의 정보 공유 게시글 불러오기 성공했습니다.');
        }
      }
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        console.log('error:' + error.response.data.errorMessage);
        const message =
          data?.errorMessage ||
          '오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        setError(message);
      } else {
        setError('나의 정보 공유 게시글 목록을 불러오는 데 실패했습니다.');
      }
    }
  };

  const handleMyQnAPostTabClick = async () => {
    try {
      if (userInfo?.id) {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_ROUTE_URL}/qna-posts/author/${userInfo?.id}`,
          {
            headers: { 'Content-Type': 'application/json' },
          },
        );
        if (response.status === 200 && response.data) {
          setMyQnAPosts(response.data.content);
          console.log('나의 Q&A 게시글 불러오기 성공했습니다.');
        }
      }
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        console.log('error:' + error.response);
        const message =
          data?.errorMessage ||
          '오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        setError(message);
      } else {
        setError('나의 Q&A 게시글 목록을 불러오는 데 실패했습니다.');
      }
    }
  };

  // 탭 클릭 시 해당 탭의 내용을 보여주는 함수
  const renderTabContent = () => {
    if (error) {
      return <p className="col-span-full text-center text-red-500">{error}</p>;
    }

    switch (activeTab) {
      case 'myStudy':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {myStudies.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">
                내가 속한 스터디가 없습니다.
              </p>
            ) : (
              myStudies.map(myStudy => (
                <MyStudyCard key={myStudy.studyPostId} post={myStudy} />
                // <div
                //   key={myStudy.id}
                //   className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
                // >
                //   <figure className="px-4 pt-4">
                //     <img
                //       src={myStudy.thumbnail || '/default-study-thumbnail.png'}
                //       alt={myStudy.name}
                //       className="rounded-xl h-48 w-full object-cover"
                //     />
                //   </figure>
                //   <div className="card-body">
                //     <h2 className="card-title text-lg font-bold">
                //       {study.name}
                //     </h2>
                //     <p className="text-sm text-base-content/70 mt-2">
                //       {study.description || '스터디 설명이 없습니다.'}
                //     </p>
                //     <div className="card-actions justify-end mt-4">
                //       <button className="btn btn-primary btn-sm">
                //         채팅방 열기
                //       </button>
                //       <button className="btn btn-secondary btn-sm">
                //         스터디룸 보기
                //       </button>
                //     </div>
                //   </div>
                // </div>
              ))
            )}
          </div>
        );
      case 'myStudyPost':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {myStudyPosts.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">
                작성한 스터디 모집 글이 없습니다.
              </p>
            ) : (
              myStudyPosts.map(myStudyPost => (
                <StudyCard key={myStudyPost.id} post={myStudyPost} />
              ))
            )}
          </div>
        );
      case 'myInfoPost':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {myInfoPosts.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">
                작성한 정보 공유 게시글이 없습니다.
              </p>
            ) : (
              myInfoPosts.map(myInfoPost => (
                <MyInfoPostCard key={myInfoPost.id} post={myInfoPost} />
              ))
            )}
          </div>
        );

      case 'myQnAPost':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {myQnAPosts.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">
                작성한 Q&A 게시글이 없습니다.
              </p>
            ) : (
              myQnAPosts.map(myQnAPost => (
                <MyQnAPostCard key={myQnAPost.id} post={myQnAPost} />
              ))
            )}
          </div>
        );
      default:
        return <p>기타 탭에 대한 내용</p>;
    }
  };

  // 탭 클릭 핸들러
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setError(null);
    if (tab === 'myStudy') {
      handleMyStudyTabClick();
    } else if (tab === 'myStudyPost') {
      handleMyStudyPostTabClick();
    } else if (tab === 'myInfoPost') {
      handleMyInfoPostTabClick();
    } else if (tab === 'myQnAPost') {
      handleMyQnAPostTabClick();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div role="tablist" className="tabs tabs-lifted">
        <button
          onClick={() => handleTabClick('myStudy')}
          className={`tab tab-lg ${
            activeTab === 'myStudy' ? 'tab-active shadow-lg font-bold' : ''
          }`}
        >
          내가 속한 스터디
        </button>
        <button
          onClick={() => handleTabClick('myStudyPost')}
          className={`tab tab-lg ${
            activeTab === 'myStudyPost' ? 'tab-active shadow-lg font-bold' : ''
          }`}
        >
          나의 스터디 모집글
        </button>
        <button
          onClick={() => handleTabClick('myInfoPost')}
          className={`tab tab-lg ${
            activeTab === 'myInfoPost' ? 'tab-active shadow-lg font-bold' : ''
          }`}
        >
          나의 정보 공유
        </button>
        <button
          onClick={() => handleTabClick('myQnAPost')}
          className={`tab tab-lg ${
            activeTab === 'myQnAPost' ? 'tab-active shadow-lg font-bold' : ''
          }`}
        >
          나의 Q&A
        </button>
      </div>
      <div className="p-4 bg-base-200 rounded-lg shadow-md border-t-4 border-primary">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default MyStudyView;
