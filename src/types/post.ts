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
