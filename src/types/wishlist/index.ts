import { Course } from '../course';

export interface Wishlist {
  id: string;
  userId: string;
  items: WishlistItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  id: string;
  courseId: string;
  course: Course;
  addedAt: string;
}
