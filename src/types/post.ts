export interface BasePost {
  id: number;
  title: string;
  content: string;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

export type InfoPost = BasePost;
export type QnAPost = BasePost;

export interface PostResponse<T> {
  data: T[];
  page: number;
  size: number;
  total_pages: number;
}

export interface StudyPost {
  id: number;
  title: string;
  thumbnail?: string;
  status: 'RECRUITING' | 'IN_PROGRESS' | 'CANCELED';
  subject:
    | 'CONCEPT_LEARNING'
    | 'PROJECT'
    | 'CHALLENGE'
    | 'CERTIFICATION'
    | 'JOB_PREPARATION'
    | 'ETC';
  difficulty: 'HIGH' | 'MEDIUM' | 'LOW';
  meetingTime: string;
  recruitmentEndDate: string;
  currentMembers: number;
  maxMembers: number;
  studyStartDate: string;
  studyEndDate: string;
}
