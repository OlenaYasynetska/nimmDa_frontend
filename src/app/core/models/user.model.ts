export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthUser extends User {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}
