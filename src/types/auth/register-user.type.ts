import { User } from '../user/user.type';

export interface RegisterData {
  name: string;
  email: string;
  role: 'user' | 'instructor';
  password: string;
  confirmPassword: string;
  avatar?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}
