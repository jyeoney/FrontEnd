export interface BasePost {
  id: number;
  title: string;
  content: string;
  thumbnailImgUrl?: string;
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
  studyName: string;
  subject: string;
  difficulty: string;
  dayType: string[];
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  meetingType: string;
  recruitmentPeriod: string;
  content: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  status: 'RECRUITING' | 'IN_PROGRESS' | 'CLOSED' | 'CANCELED';
  thumbnailImgUrl: string | null;
  maxParticipants: number;
  currentParticipants: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}
