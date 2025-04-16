export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'instructor' | 'admin';
  avatar?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}
