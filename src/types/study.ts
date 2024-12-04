import { BasePost } from './post';

export type StudySubject =
  | 'CONCEPT_LEARNING'
  | 'PROJECT'
  | 'CHALLENGE'
  | 'CERTIFICATION'
  | 'JOB_PREPARATION'
  | 'ETC';

export type StudyDifficulty = 'HIGH' | 'MEDIUM' | 'LOW';
export type StudyMeetingType = 'ONLINE' | 'HYBRID';
export type StudyStatus = 'RECRUITING' | 'IN_PROGRESS' | 'CANCELED';
export type DayType = '월' | '화' | '수' | '목' | '금' | '토' | '일';

export interface StudyPost extends BasePost {
  subject: StudySubject;
  difficulty: StudyDifficulty;
  recruitmentStartDate: string;
  recruitmentEndDate: string;
  studyStartDate: string;
  studyEndDate: string;
  currentMembers: number;
  maxMembers: number;
  meetingTime: string;
  status: StudyStatus;
  meeting_type: StudyMeetingType;
  dayType: DayType[];
  latitude: number;
  longitude: number;
  address: string;
}

export interface StudyResponse {
  data: StudyPost[];
  page: number;
  size: number;
  total_pages: number;
}

export const SUBJECT_OPTIONS = {
  CONCEPT_LEARNING: '개념학습',
  PROJECT: '프로젝트',
  CHALLENGE: '챌린지',
  CERTIFICATION: '자격증/시험',
  JOB_PREPARATION: '취업/코테',
  ETC: '기타',
} as const;

export const DIFFICULTY_OPTIONS = {
  HIGH: '상',
  MEDIUM: '중',
  LOW: '하',
} as const;

export const MEETING_TYPE = {
  ONLINE: '온라인',
  HYBRID: '병행',
} as const;

export const STATUS_OPTIONS = {
  RECRUITING: '모집 중',
  IN_PROGRESS: '진행 중',
  CANCELED: '모집 취소',
} as const;

export const DAY_TYPE_FLAGS = {
  MONDAY: 1, // 2^0
  TUESDAY: 2, // 2^1
  WEDNESDAY: 4, // 2^2
  THURSDAY: 8, // 2^3
  FRIDAY: 16, // 2^4
  SATURDAY: 32, // 2^5
  SUNDAY: 64, // 2^6
} as const;

export const DAY_KOREAN = {
  MONDAY: '월',
  TUESDAY: '화',
  WEDNESDAY: '수',
  THURSDAY: '목',
  FRIDAY: '금',
  SATURDAY: '토',
  SUNDAY: '일',
} as const;
