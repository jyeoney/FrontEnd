import { StudyDifficulty, StudySubject } from '@/types/study';
import {
  SUBJECT_OPTIONS,
  DIFFICULTY_OPTIONS,
  MEETING_TYPE,
  RECRUITMENT_STATUS,
  STUDY_STATUS,
} from '@/types/study';

export const convertDifficulty = (difficulty: string): StudyDifficulty => {
  const difficultyMap: Record<string, StudyDifficulty> = {
    상: 'HIGH',
    중: 'MEDIUM',
    하: 'LOW',
  };
  return difficultyMap[difficulty];
};

export const convertSubject = (subject: string): StudySubject => {
  const subjectMap: Record<string, StudySubject> = {
    개념학습: 'CONCEPT_LEARNING',
    프로젝트: 'PROJECT',
    챌린지: 'CHALLENGE',
    '자격증/시험': 'CERTIFICATION',
    '취업/코테': 'JOB_PREPARATION',
    기타: 'ETC',
  };
  return subjectMap[subject];
};

// 상태 변환 (RECRUITING -> 모집 중)
export const convertStatus = (status: string): string => {
  return (
    RECRUITMENT_STATUS[status as keyof typeof RECRUITMENT_STATUS] || status
  );
};

// 미팅 타입 변환 (ONLINE -> 온라인)
export const convertMeetingType = (type: string): string => {
  return MEETING_TYPE[type as keyof typeof MEETING_TYPE] || type;
};

// 난이도 변환 (HIGH -> 상)
export const convertDifficultyToKorean = (difficulty: string): string => {
  return (
    DIFFICULTY_OPTIONS[difficulty as keyof typeof DIFFICULTY_OPTIONS] ||
    difficulty
  );
};

// 주제 변환 (CONCEPT_LEARNING -> 개념학습)
export const convertSubjectToKorean = (subject: string): string => {
  return SUBJECT_OPTIONS[subject as keyof typeof SUBJECT_OPTIONS] || subject;
};

// 모집글 상태 변환
export const convertRecruitmentStatus = (status: string): string => {
  return (
    RECRUITMENT_STATUS[status as keyof typeof RECRUITMENT_STATUS] || status
  );
};

// 스터디 진행 상태 변환
export const convertStudyStatus = (status: string): string => {
  return STUDY_STATUS[status as keyof typeof STUDY_STATUS] || status;
};
