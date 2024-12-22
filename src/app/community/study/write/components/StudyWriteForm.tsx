'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import OnlineForm from './OnlineForm';
import HybridForm from './HybridForm';
import { MEETING_TYPE } from '@/types/study';

type StudyType = 'ONLINE' | 'HYBRID';

export default function StudyWriteForm() {
  const [studyType, setStudyType] = useState<StudyType>('ONLINE');
  const searchParams = useSearchParams();

  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'HYBRID') {
      setStudyType('HYBRID');
    }
  }, [searchParams]);

  return (
    <>
      <div className="tabs tabs-boxed">
        <button
          className={`tab ${studyType === 'ONLINE' ? 'bg-black text-white border-transparent' : 'text-gray-700 hover:text-white hover:bg-gray-500'}`}
          onClick={() => setStudyType('ONLINE')}
        >
          {MEETING_TYPE.ONLINE}
        </button>
        <button
          className={`tab ${studyType === 'HYBRID' ? 'bg-black text-white border-transparent' : 'text-gray-700 hover:text-white hover:bg-gray-500'}`}
          onClick={() => setStudyType('HYBRID')}
        >
          {MEETING_TYPE.HYBRID}
        </button>
      </div>

      {studyType === 'ONLINE' ? <OnlineForm /> : <HybridForm />}
    </>
  );
}
