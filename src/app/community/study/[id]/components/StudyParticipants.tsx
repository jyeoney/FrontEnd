'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { User } from '@/types/user';

interface StudyParticipantsProps {
  studyId: string;
}

export default function StudyParticipants({ studyId }: StudyParticipantsProps) {
  const [participants, setParticipants] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await axios.get(`/api/study/${studyId}/participants`);
        setParticipants(response.data);
      } catch (error) {
        console.error('참여자 목록 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParticipants();
  }, [studyId]);

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-4">참여자 목록</h3>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>닉네임</th>
            </tr>
          </thead>
          <tbody>
            {participants.map(participant => (
              <tr key={participant.id}>
                <td>{participant.nickname}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
