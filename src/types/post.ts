export interface BasePost {
  id: number;
  title: string;
  content: string;
  thumbnailImgUrl?: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  user: {
    id: number;
    username: string;
  };
}

export type InfoPost = BasePost;
export type QnAPost = BasePost;

export interface PostResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalPages: number;
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
  description: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  status: 'RECRUITING' | 'CLOSED' | 'CANCELED';
  thumbnailImgUrl: string | null;
  maxParticipants: number;
  currentParticipants: number;
  user: {
    id: number;
    nickname: string;
    email: string;
    profileImageUrl: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}
