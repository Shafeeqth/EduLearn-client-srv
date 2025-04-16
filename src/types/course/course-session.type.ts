import { Lesson } from './course-lesson.type';

export interface CourseSection {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: string;
  lessons: Lesson[];
  createdAt: string;
  updatedAt: string;
}
