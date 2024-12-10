'use client';

import { useState } from 'react';

interface Study {
  id: string;
  name: string;
  thumbnail?: string; // 썸네일 추가
  description?: string; // 설명 추가
}

interface MyPageProps {
  studies: Study[];
}

const MyStudyView = ({ studies }: MyPageProps) => {
  const [activeTab, setActiveTab] = useState('myStudy'); // 기본값을 'myStudy'

  const handleMyStudyTabClick = () => {
    setActiveTab('');
  };

  // 탭 클릭 시 해당 탭의 내용을 보여주는 함수
  const renderTabContent = () => {
    switch (activeTab) {
      case 'myStudy':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {studies.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">
                스터디 목록이 없습니다.
              </p>
            ) : (
              studies.map(study => (
                <div
                  key={study.id}
                  className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
                >
                  <figure className="px-4 pt-4">
                    <img
                      src={study.thumbnail || '/default-study-thumbnail.png'}
                      alt={study.name}
                      className="rounded-xl h-48 w-full object-cover"
                    />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title text-lg font-bold">
                      {study.name}
                    </h2>
                    <p className="text-sm text-base-content/70 mt-2">
                      {study.description || '스터디 설명이 없습니다.'}
                    </p>
                    <div className="card-actions justify-end mt-4">
                      <button className="btn btn-primary btn-sm">
                        채팅방 열기
                      </button>
                      <button className="btn btn-secondary btn-sm">
                        스터디룸 보기
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        );
      case 'study':
        return (
          <div>
            <p>나의 스터디 모집글 탭 내용</p>
          </div>
        );
      case 'info':
        return <p>나의 정보공유 탭 내용</p>;
      case 'qna':
        return <p>나의 Q&A 탭 내용</p>;
      default:
        return <p>기타 탭에 대한 내용</p>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* DaisyUI 탭 구조 */}
      <div role="tablist" className="tabs tabs-lifted">
        <button
          onClick={() => setActiveTab('myStudy')}
          className={`tab tab-lg ${
            activeTab === 'myStudy' ? 'tab-active shadow-lg font-bold' : ''
          }`}
        >
          내가 속한 스터디
        </button>
        <button
          onClick={() => setActiveTab('study')}
          className={`tab tab-lg ${
            activeTab === 'study' ? 'tab-active shadow-lg font-bold' : ''
          }`}
        >
          나의 스터디 모집글
        </button>
        <button
          onClick={() => setActiveTab('info')}
          className={`tab tab-lg ${
            activeTab === 'info' ? 'tab-active shadow-lg font-bold' : ''
          }`}
        >
          나의 정보 공유
        </button>
        <button
          onClick={() => setActiveTab('qna')}
          className={`tab tab-lg ${
            activeTab === 'qna' ? 'tab-active shadow-lg font-bold' : ''
          }`}
        >
          나의 Q&A
        </button>
      </div>

      {/* 탭 내용 */}
      <div className="p-4 bg-base-200 rounded-lg shadow-md border-t-4 border-primary">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default MyStudyView;
