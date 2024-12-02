import {
  StudyDifficulty,
  StudySubject,
  DAY_TYPE_FLAGS,
  DAY_KOREAN,
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

export const convertDaysToBitFlag = (selectedDays: string[]): number => {
  const dayMap: Record<string, number> = {
    월: DAY_TYPE_FLAGS.MONDAY,
    화: DAY_TYPE_FLAGS.TUESDAY,
    수: DAY_TYPE_FLAGS.WEDNESDAY,
    목: DAY_TYPE_FLAGS.THURSDAY,
    금: DAY_TYPE_FLAGS.FRIDAY,
    토: DAY_TYPE_FLAGS.SATURDAY,
    일: DAY_TYPE_FLAGS.SUNDAY,
  };

  return selectedDays.reduce((flag, day) => flag | dayMap[day], 0);
};

export const convertBitFlagToDays = (bitFlag: number): string[] => {
  const days: string[] = [];
  Object.entries(DAY_TYPE_FLAGS).forEach(([key, value]) => {
    if (bitFlag & value) {
      days.push(DAY_KOREAN[key as keyof typeof DAY_KOREAN]);
    }
  });
  return days;
};
