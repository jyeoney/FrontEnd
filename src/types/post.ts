export interface StudyPost extends BasePost {
  subject:
    | '개념 학습'
    | '프로젝트'
    | '알고리즘'
    | '코딩테스트'
    | '챌린지'
    | '자격증/시험'
    | '취업/코테'
    | '기타';
  difficulty: '상' | '중' | '하';
  thumbnail?: string;
  recruitmentStartDate: string;
  recruitmentEndDate: string;
  studyStartDate: string;
  studyEndDate: string;
  currentMembers: number;
  maxMembers: number;
  meetingTime: string;
  status: '모집 중' | '모집 완료' | '진행 중' | '종료';
  meeting_type: 'Online' | '오프라인';
  days: ('월' | '화' | '수' | '목' | '금' | '토' | '일')[];
}

export interface StudyResponse {
  data: StudyPost[];
  page: number;
  size: number;
  total_pages: number;
}

export interface BasePost {
  id: number;
  title: string;
  content: string;
  thumbnail?: string;
}

export type InfoPost = BasePost;
export type QnAPost = BasePost;

export interface PostResponse<T> {
  data: T[];
  page: number;
  size: number;
  total_pages: number;
}
