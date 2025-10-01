import { UserFilters } from '@/services/admin.service';
import { CourseFilters } from '@/services/course-service';

/**
 * queryKeys - Centralized registry for React Query keys.
 * Use these to ensure cache consistency and avoid typos.
 */
export const queryKeys = {
  users: {
    all: (): readonly ['users'] => ['users'] as const,
    lists: (): readonly ['users', 'list'] => [...queryKeys.users.all(), 'list'] as const,
    list: (filters: Partial<UserFilters>): readonly ['users', 'list', Partial<UserFilters>] =>
      [...queryKeys.users.lists(), filters] as const,
    details: (): readonly ['users', 'detail'] => [...queryKeys.users.all(), 'detail'] as const,
    detail: (userId: string): readonly ['users', 'detail', string] =>
      [...queryKeys.users.details(), userId] as const,
  },
  courses: {
    all: (): readonly ['courses'] => ['courses'] as const,
    lists: (): readonly ['courses', 'list'] => [...queryKeys.courses.all(), 'list'] as const,
    list: (filters: Partial<CourseFilters>): readonly ['courses', 'list', Partial<CourseFilters>] =>
      [...queryKeys.courses.lists(), filters] as const,
    details: (): readonly ['courses', 'detail'] => [...queryKeys.courses.all(), 'detail'] as const,
    detail: (courseId: string): readonly ['courses', 'detail', string] =>
      [...queryKeys.courses.details(), courseId] as const,
    featured: (): readonly ['courses', 'featured'] =>
      [...queryKeys.courses.all(), 'featured'] as const,
    bySlug: (slug: string): readonly ['courses', 'slug', string] =>
      [...queryKeys.courses.all(), 'slug', slug] as const,
    related: (courseId: string): readonly ['courses', 'detail', string, 'related'] =>
      [...queryKeys.courses.detail(courseId), 'related'] as const,
  },
  lessons: {
    all: (courseId: string): readonly ['courses', string, 'lessons'] =>
      ['courses', courseId, 'lessons'] as const,
    lists: (courseId: string): readonly ['courses', string, 'lessons', 'list'] =>
      [...queryKeys.lessons.all(courseId), 'list'] as const,
    details: (courseId: string): readonly ['courses', string, 'lessons', 'detail'] =>
      [...queryKeys.lessons.all(courseId), 'detail'] as const,
    detail: (
      courseId: string,
      lessonId: string
    ): readonly ['courses', string, 'lessons', 'detail', string] =>
      [...queryKeys.lessons.details(courseId), lessonId] as const,
  },
  categories: {
    all: (): readonly ['categories'] => ['categories'] as const,
    list: (): readonly ['categories', 'list'] => [...queryKeys.categories.all(), 'list'] as const,
  },
  reviews: {
    all: (): readonly ['reviews'] => ['reviews'] as const,
    byCourse: (courseId: string): readonly ['reviews', 'course', string] =>
      [...queryKeys.reviews.all(), 'course', courseId] as const,
  },
} as const;
