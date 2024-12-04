import { StudyDifficulty, StudySubject } from '@/types/study';

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
