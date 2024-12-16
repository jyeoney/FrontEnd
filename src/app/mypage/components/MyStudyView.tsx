'use client';

import { useRouter } from 'next/navigation';
import { StudyPost, InfoPost, QnAPost } from '@/types/post';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import MyStudyCard from './MyStudyCard';
import { MyStudyCardData } from './MyStudyCard';
import { StudyCard } from '@/app/community/study/components/StudyCard';
import MyInfoPostCard from './MyInfoPostCard';
import MyQnAPostCard from './MyQnAPostCard';
import Pagination from './Pagination';

const MyStudyView = () => {
  const { userInfo, isSignedIn, resetStore } = useAuthStore();
  const [activeTab, setActiveTab] = useState('myStudy'); // 기본값을 'myStudy'
  const [myStudies, setMyStudies] = useState<MyStudyCardData[]>([]);
  const [myStudyPosts, setMyStudyPosts] = useState<StudyPost[]>([]);
  const [myInfoPosts, setMyInfoPosts] = useState<InfoPost[]>([]);
  const [myQnAPosts, setMyQnAPosts] = useState<QnAPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 12,
    totalElements: 0,
  });

  const router = useRouter();

  // useEffect(() => {
  //   if (isSignedIn === false) {
  //     resetStore();
  //     router.push('/signin');
  //   }
  // }, [isSignedIn]);

  useEffect(() => {
    // 마이페이지가 처음 로드될 때 'myStudy' 탭 클릭 상태
    if (isSignedIn && userInfo?.id) {
      handleTabClick('myStudy');
    }
  }, [isSignedIn, userInfo]);

  // const handleTabClick = async (tab: string, page = 0) => {
  //   setActiveTab(tab);
  //   setError(null);
  //   try {
  //     let url = '';
  //     if (tab === 'myStudy') {
  //       url = `${process.env.NEXT_PUBLIC_API_ROUTE_URL}/study/author/${userInfo?.id}?page=${page}`;
  //     } else if (tab === 'myStudyPost') {
  //       url = `${process.env.NEXT_PUBLIC_API_ROUTE_URL}/study-posts/author/${userInfo?.id}?page=${page}`;
  //     } else if (tab === 'myInfoPost') {
  //       url = `${process.env.NEXT_PUBLIC_API_ROUTE_URL}/info-posts/author/${userInfo?.id}?page=${page}`;
  //     } else if (tab === 'myQnAPost') {
  //       url = `${process.env.NEXT_PUBLIC_API_ROUTE_URL}/qna-posts/author/${userInfo?.id}?page=${page}`;
  //     }

  //     const response = await axios.get(url, {
  //       headers: { 'Content-Type': 'application/json' },
  //     });
  //     if (response.status === 200 && response.data) {
  //       const data = response.data;

  //       // Update the state based on the active tab
  //       if (tab === 'myStudy') {
  //         setMyStudies(data.content);
  //       } else if (tab === 'myStudyPost') {
  //         setMyStudyPosts(data.content);
  //       } else if (tab === 'myInfoPost') {
  //         setMyInfoPosts(data.content);
  //       } else if (tab === 'myQnAPost') {
  //         setMyQnAPosts(data.content);
  //       }

  //       // Update pagination state
  //       setPagination({
  //         currentPage: data.pageable.pageNumber,
  //         totalPages: data.totalPages,
  //       });
  //     }
  //   } catch (error: any) {
  //     const message =
  //       error.response?.data?.errorMessage ||
  //       '오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
  //     setError(message);
  //   }
  // };

  // const handlePageChange = (newPage: number) => {
  //   handleTabClick(activeTab, newPage);
  // };

  // 탭 클릭 핸들러
  const handleTabClick = (tab: string, page = 0) => {
    setActiveTab(tab);
    setError(null);
    if (tab === 'myStudy') {
      handleMyStudyTabClick(page);
    } else if (tab === 'myStudyPost') {
      handleMyStudyPostTabClick(page);
    } else if (tab === 'myInfoPost') {
      handleMyInfoPostTabClick(page);
    } else if (tab === 'myQnAPost') {
      handleMyQnAPostTabClick(page);
    }
  };

  const handlePageChange = (newPage: number) => {
    handleTabClick(activeTab, newPage);
  };

  const handleMyStudyTabClick = async (page: number) => {
    try {
      if (userInfo?.id) {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_ROUTE_URL}/study/author/${userInfo?.id}?page=${page}`,
        );

        if (response.status === 200 && response.data) {
          setMyStudies(response.data.content);

          setPagination({
            currentPage: response.data.pageable.pageNumber + 1,
            pageSize: response.data.pageable.pageSize,
            totalElements: response.data.totalElements,
          });
        }
      }
    } catch (error: any) {
      console.log('에러 상태코드', error.response.status);
      if (error.response) {
        const { status, data } = error.response;
        console.log('error:' + error.response);
        const message =
          data?.errorMessage ||
          '오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        setError(message);
        if (status === 401) {
          console.log('토큰 문제 발생. 로그인이 필요합니다.');
          router.push('/signin');
          resetStore();
        } else {
          setError(message);
        }
      } else {
        setError('내가 속한 스터디 목록을 불러오는 데 실패했습니다.');
      }
    }
  };

  const handleMyStudyPostTabClick = async (page: number) => {
    try {
      if (userInfo?.id) {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_ROUTE_URL}/study-posts/author/${userInfo?.id}?page=${page}`,
          {
            headers: { 'Content-Type': 'application/json' },
          },
        );
        if (response.status === 200 && response.data) {
          setMyStudyPosts(response.data.content);

          setPagination({
            currentPage: response.data.pageable.pageNumber + 1,
            pageSize: response.data.pageable.pageSize,
            totalElements: response.data.totalElements,
          });
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
        if (status === 401) {
          console.log('토큰 문제 발생. 로그인이 필요합니다.');
          router.push('/signin');
          resetStore();
        } else {
          setError(message);
        }
      } else {
        setError('나의 스터디 모집 글 목록을 불러오는 데 실패했습니다.');
      }
    }
  };

  const handleMyInfoPostTabClick = async (page: number) => {
    try {
      if (userInfo?.id) {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_ROUTE_URL}/info-posts/author/${userInfo?.id}?page=${page}`,
          {
            headers: { 'Content-Type': 'application/json' },
          },
        );
        if (response.status === 200 && response.data) {
          setMyInfoPosts(response.data.content);

          setPagination({
            currentPage: response.data.pageable.pageNumber + 1,
            pageSize: response.data.pageable.pageSize,
            totalElements: response.data.totalElements,
          });
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
        if (status === 401) {
          console.log('토큰 문제 발생. 로그인이 필요합니다.');
          router.push('/signin');
          resetStore();
        } else {
          setError(message);
        }
      } else {
        setError('나의 정보 공유 게시글 목록을 불러오는 데 실패했습니다.');
      }
    }
  };

  const handleMyQnAPostTabClick = async (page: number) => {
    try {
      if (userInfo?.id) {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_ROUTE_URL}/qna-posts/author/${userInfo?.id}?page=${page}`,
          {
            headers: { 'Content-Type': 'application/json' },
          },
        );
        if (response.status === 200 && response.data) {
          setMyQnAPosts(response.data.content);

          setPagination({
            currentPage: response.data.pageable.pageNumber + 1,
            pageSize: response.data.pageable.pageSize,
            totalElements: response.data.totalElements,
          });
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
        if (status === 401) {
          console.log('토큰 문제 발생. 로그인이 필요합니다.');
          router.push('/signin');
          resetStore();
        } else {
          setError(message);
        }
      } else {
        setError('나의 Q&A 게시글 목록을 불러오는 데 실패했습니다.');
      }
    }
  };

  // 탭 클릭 시 해당 탭의 내용을 보여주는 함수
  const renderTabContent = () => {
    if (!isSignedIn) {
      return (
        <p className="col-span-full text-center text-gray-500">
          로그인이 필요합니다.
        </p>
      );
    }
    if (error) {
      return <p className="col-span-full text-center text-red-500">{error}</p>;
    }

    switch (activeTab) {
      case 'myStudy':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {!isSignedIn ? (
              <p className="col-span-full text-center text-gray-500">
                로그인이 필요합니다.
              </p>
            ) : !myStudies ? (
              <p className="col-span-full text-center text-gray-500">
                내가 속한 스터디를 불러오는 중입니다...
              </p>
            ) : myStudies.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">
                내가 속한 스터디가 없습니다.
              </p>
            ) : (
              myStudies.map(myStudy => (
                <MyStudyCard key={myStudy.studyPostId} post={myStudy} />
              ))
            )}
          </div>
        );
      case 'myStudyPost':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {!isSignedIn ? (
              <p className="col-span-full text-center text-gray-500">
                로그인이 필요합니다.
              </p>
            ) : !myStudyPosts ? (
              <p className="col-span-full text-center text-gray-500">
                작성한 스터디 모집 글을 불러오는 중입니다...
              </p>
            ) : myStudyPosts.length === 0 ? (
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
            {!isSignedIn ? (
              <p className="col-span-full text-center text-gray-500">
                로그인이 필요합니다.
              </p>
            ) : !myInfoPosts ? (
              <p className="col-span-full text-center text-gray-500">
                작성한 정보 공유 게시글을 불러오는 중입니다...
              </p>
            ) : myInfoPosts.length === 0 ? (
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
            {!isSignedIn ? (
              <p className="col-span-full text-center text-gray-500">
                로그인이 필요합니다.
              </p>
            ) : !myQnAPosts ? (
              <p className="col-span-full text-center text-gray-500">
                작성한 Q&A 게시글을 불러오는 중입니다...
              </p>
            ) : myQnAPosts.length === 0 ? (
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
        <div>
          {renderTabContent()}
          <Pagination
            totalElements={pagination.totalElements} // 전체 게시물 수
            pageSize={pagination.pageSize} // 한 페이지에 표시할 게시물 수
            currentPage={pagination.currentPage} // 현재 페이지
            onPageChange={handlePageChange} // 페이지 변경 함수
          />
        </div>
      </div>
    </div>
  );
};

export default MyStudyView;
