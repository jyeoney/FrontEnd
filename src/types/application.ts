export interface Application {
  signupId: number;
  userId: number;
  nickname: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}
