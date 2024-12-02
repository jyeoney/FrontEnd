'use client';

import { useState } from 'react';
import OnlineForm from './components/OnlineForm';
import HybridForm from './components/HybridForm';
import { MEETING_TYPE } from '@/types/study';

type StudyType = 'ONLINE' | 'HYBRID';

export default function StudyWritePage() {
  const [studyType, setStudyType] = useState<StudyType>('ONLINE');

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">스터디 모집글 작성</h1>

      <div className="tabs tabs-boxed">
        <button
          className={`tab ${studyType === 'ONLINE' ? 'tab-active' : ''}`}
          onClick={() => setStudyType('ONLINE')}
        >
          {MEETING_TYPE.ONLINE}
        </button>
        <button
          className={`tab ${studyType === 'HYBRID' ? 'tab-active' : ''}`}
          onClick={() => setStudyType('HYBRID')}
        >
          {MEETING_TYPE.HYBRID}
        </button>
      </div>

      {studyType === 'ONLINE' ? <OnlineForm /> : <HybridForm />}
    </div>
  );
}
