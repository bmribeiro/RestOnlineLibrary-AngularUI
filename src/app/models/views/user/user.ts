export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  userStatus: boolean;
  createdAt: Date;
  userStatusChangedAt: Date;
}
