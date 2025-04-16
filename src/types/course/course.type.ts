import { CourseSection } from './course-session.type';

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  thumbnail?: string;
  coverImage?: string;
  instructorId: string;
  price: number;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  enrollmentCount: number;
  rating?: number;
  ratingCount?: number;
  sections: CourseSection[];
  createdAt: string;
}
