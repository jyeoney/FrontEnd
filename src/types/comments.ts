export interface User {
  id: number;
  nickname: string;
  email: string;
  profileImageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  user?: {
    nickname: string;
  };
  userDto?: {
    nickname: string;
  };
  replies: Comment[];
}
