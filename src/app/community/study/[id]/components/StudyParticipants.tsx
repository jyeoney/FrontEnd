'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { User } from '@/types/user';
import { StudyPost } from '@/types/post';

interface StudyParticipantsProps {
  studyId: string;
  study: StudyPost;
}

interface Participant {
  studentId: number;
  user: User;
  isLeader: boolean;
}

export default function StudyParticipants({
  studyId,
  study,
}: StudyParticipantsProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchParticipants = async () => {
      if (!study || study.status !== 'IN_PROGRESS') {
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/api/study/${studyId}/participants`);
        if (response.status === 200) {
          setParticipants(response.data);
        }
      } catch (error) {
        console.error('참가자 목록 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParticipants();
  }, [studyId, study]);

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-4">참여자 목록</h3>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>닉네임</th>
              <th>역할</th>
            </tr>
          </thead>
          <tbody>
            {participants.map(participant => (
              <tr key={participant.studentId}>
                <td>{participant.user.nickname}</td>
                <td>{participant.isLeader ? '스터디장' : '스터디원'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
