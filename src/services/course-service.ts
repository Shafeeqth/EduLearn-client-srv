import { BaseService } from './base-api/base.service';
import { config } from '@/lib/config';
import { store } from '@/store';
import {
  Lesson,
  LessonPayload,
  Quiz,
  QuizPayload,
  Section,
  SectionPayload,
  Course,
} from '@/types/course';
import { ApiResponse, PaginatedResponse } from '@/types/api-response';
import { BasicInfoRequestPayload, CourseData } from '@/types/course/original';
import { refreshToken } from '@/store/slices/auth-slice';

export interface CourseFilters {
  page: string;
  limit: string;
  searchTerm: string;
  sortBy: string;
  sortOrder: string;
  category: string;
  level: string;
  instructorId: string;
  minPrice: string;
  maxPrice: string;
}

export interface ICourseService {
  getCourses(filters?: CourseFilters): Promise<PaginatedResponse<Course>>;
  getCourseById(courseId: string): Promise<ApiResponse<Course>>;
  getCourseBySlug(slug: string): Promise<ApiResponse<Course>>;
  createCourse(data: Partial<BasicInfoRequestPayload>): Promise<ApiResponse<Course>>;
  updateCourse(courseId: string, data: Partial<CourseData>): Promise<ApiResponse<Course>>;
  deleteCourse(courseId: string): Promise<ApiResponse<void>>;
  getRelatedCourses(courseId: string, limit?: number): Promise<ApiResponse<Course[]>>;
  getSectionById(courseId: string, sectionId: string): Promise<ApiResponse<Section>>;
  getSections(courseId: string): Promise<ApiResponse<Section[]>>;
  createSection(courseId: string, data: Partial<SectionPayload>): Promise<ApiResponse<Section>>;
  updateSection(
    courseId: string,
    sectionId: string,
    data: Partial<SectionPayload>
  ): Promise<ApiResponse<Section>>;
  deleteSection(courseId: string, sectionId: string): Promise<ApiResponse<void>>;
  getLessons(courseId: string, sectionId: string): Promise<ApiResponse<Lesson>[]>;
  getLessonById(
    courseId: string,
    sectionId: string,
    lessonId: string
  ): Promise<ApiResponse<Lesson>>;
  createLesson(
    courseId: string,
    sectionId: string,
    data: Partial<LessonPayload>
  ): Promise<ApiResponse<Lesson>>;
  updateLesson(
    courseId: string,
    sectionId: string,
    lessonId: string,
    data: Partial<LessonPayload>
  ): Promise<ApiResponse<Lesson>>;
  deleteLesson(courseId: string, section: string, lessonId: string): Promise<ApiResponse<void>>;
  deleteQuiz(courseId: string, sectionId: string, quizId: string): Promise<ApiResponse<void>>;
  getQuizzes(courseId: string, sectionId: string): Promise<ApiResponse<Quiz[]>>;
  getQuizById(courseId: string, sectionId: string, quizId: string): Promise<ApiResponse<Quiz>>;
  createQuiz(
    courseId: string,
    sectionId: string,
    data: Partial<QuizPayload>
  ): Promise<ApiResponse<Quiz>>;
  updateQuiz(
    courseId: string,
    sectionId: string,
    quizId: string,
    data: Partial<QuizPayload>
  ): Promise<ApiResponse<Quiz>>;
  getCourseByInstructor(
    instructorId: string
  ): Promise<ApiResponse<{ courses: Course[]; total: number }>>;
  enrollInCourse(courseId: string): Promise<ApiResponse<Course>>;
  getFeaturedCourses(): Promise<ApiResponse<Course[]>>;
  // getEnrollments(): Promise<ApiResponse<Enrollment>[]>;
}

// Token getter for client-side singleton
const getToken = () => store.getState().auth.token;

const authRefresh = async () => {
  const response = await store.dispatch(refreshToken());
  if (
    response.meta.requestStatus === 'rejected' ||
    !(response.payload as { success: boolean; message: string })?.success
  ) {
    throw new Error((response.payload as { success: boolean; message: string })?.message);
  }

  return { token: (response.payload as { data: { token: string } })?.data?.token };
};

export class CourseService extends BaseService implements ICourseService {
  constructor(
    tokenGetter: () => string | null = getToken,
    refresh: () => Promise<{
      token: string;
    }> = authRefresh
  ) {
    super(`${config.apiUrl}/courses`, {
      getToken: tokenGetter,
      authRefresh: refresh,
    });
  }

  public async getCourses(filters?: Partial<CourseFilters>): Promise<PaginatedResponse<Course>> {
    const queryParams = new URLSearchParams();
    if (filters?.page) queryParams.append('page', filters.page.toString());
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());
    if (filters?.searchTerm) queryParams.append('q', filters.searchTerm.toString());
    if (filters?.sortBy) queryParams.append('sortBy', filters.sortBy.toString());
    if (filters?.sortOrder) queryParams.append('sortOrder', filters.sortOrder.toString());
    if (filters?.category) queryParams.append('category', filters.category.toString());
    if (filters?.level) queryParams.append('level', filters.level.toString());
    if (filters?.instructorId) queryParams.append('instructorId', filters.instructorId.toString());
    if (filters?.minPrice && parseInt(filters.minPrice) > 0)
      queryParams.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice && parseInt(filters.maxPrice) > 0)
      queryParams.append('maxPrice', filters.maxPrice.toString());
    const queryString = queryParams.toString();
    return this.get<PaginatedResponse<Course>>(queryString ? `?${queryString}` : '');
  }

  public async getCourseById(courseId: string): Promise<ApiResponse<Course>> {
    return this.get<ApiResponse<Course>>(`${courseId}`);
  }

  public getCourseBySlug(slug: string): Promise<ApiResponse<Course>> {
    return this.get<ApiResponse<Course>>(`/slug/${slug}`);
  }

  public createCourse(data: Partial<BasicInfoRequestPayload>): Promise<ApiResponse<Course>> {
    return this.post<ApiResponse<Course>>('/', data);
  }

  public updateCourse(
    courseId: string,
    data: Partial<BasicInfoRequestPayload>
  ): Promise<ApiResponse<Course>> {
    return this.patch<ApiResponse<Course>>(`/${courseId}`, data);
  }

  public async deleteCourse(courseId: string): Promise<ApiResponse<void>> {
    return this.delete<ApiResponse<void>>(`/${courseId}`);
  }

  public async getRelatedCourses(
    courseId: string,
    limit: number = 4
  ): Promise<ApiResponse<Course[]>> {
    return this.get<ApiResponse<Course[]>>(`/${courseId}/related?limit=${limit}`);
  }

  public async getLessonById(
    courseId: string,
    sectionId: string,
    lessonId: string
  ): Promise<ApiResponse<Lesson>> {
    return this.get<ApiResponse<Lesson>>(`/${courseId}/sections/${sectionId}/lessons/${lessonId}`);
  }

  public async getLessons(courseId: string, sectionId: string): Promise<ApiResponse<Lesson>[]> {
    return this.get<ApiResponse<Lesson>[]>(`/${courseId}/sections/${sectionId}/lessons`);
  }

  public async createLesson(
    courseId: string,
    sectionId: string,
    data: Partial<LessonPayload>
  ): Promise<ApiResponse<Lesson>> {
    return this.post<ApiResponse<Lesson>>(`/${courseId}/sections/${sectionId}/lessons`, data);
  }

  public async updateLesson(
    courseId: string,
    sectionId: string,
    lessonId: string,
    data: Partial<LessonPayload>
  ): Promise<ApiResponse<Lesson>> {
    return this.patch<ApiResponse<Lesson>>(
      `/${courseId}/sections/${sectionId}lessons/${lessonId}`,
      data
    );
  }

  public async deleteLesson(
    courseId: string,
    sectionId: string,
    lessonId: string
  ): Promise<ApiResponse<void>> {
    return this.delete<ApiResponse<void>>(`/${courseId}/sections/${sectionId}/lessons/${lessonId}`);
  }

  createQuiz(
    courseId: string,
    sectionId: string,
    data: Partial<QuizPayload>
  ): Promise<ApiResponse<Quiz>> {
    return this.post<ApiResponse<Quiz>>(`/${courseId}/sections/${sectionId}/quizzes`, data);
  }

  getCourseByInstructor(
    instructorId: string
  ): Promise<ApiResponse<{ courses: Course[]; total: number }>> {
    return this.get<ApiResponse<{ courses: Course[]; total: number }>>(
      `/instructor/${instructorId}`
    );
  }

  createSection(courseId: string, data: Partial<SectionPayload>): Promise<ApiResponse<Section>> {
    return this.post<ApiResponse<Section>>(`/${courseId}/sections`, data);
  }

  deleteQuiz(courseId: string, sectionId: string, quizId: string): Promise<ApiResponse<void>> {
    return this.delete<ApiResponse<void>>(`/${courseId}/sections/${sectionId}/quizzes/${quizId}`);
  }

  deleteSection(courseId: string, sectionId: string): Promise<ApiResponse<void>> {
    return this.delete<ApiResponse<void>>(`/${courseId}/sections/${sectionId}`);
  }

  enrollInCourse(courseId: string): Promise<ApiResponse<Course>> {
    return this.post<ApiResponse<Course>>(`/${courseId}/enroll`);
  }

  getFeaturedCourses(): Promise<ApiResponse<Course[]>> {
    return this.get<ApiResponse<Course[]>>(`/featured`);
  }

  getQuizById(courseId: string, sectionId: string, quizId: string): Promise<ApiResponse<Quiz>> {
    return this.get<ApiResponse<Quiz>>(`/${courseId}/sections/${sectionId}/quizzes/${quizId}`);
  }

  getQuizzes(courseId: string, sectionId: string): Promise<ApiResponse<Quiz[]>> {
    return this.get<ApiResponse<Quiz[]>>(`/${courseId}/sections/${sectionId}`);
  }

  getSectionById(courseId: string, sectionId: string): Promise<ApiResponse<Section>> {
    return this.get<ApiResponse<Section>>(`/${courseId}/sections/${sectionId}`);
  }

  getSections(courseId: string): Promise<ApiResponse<Section[]>> {
    return this.get<ApiResponse<Section[]>>(`/${courseId}`);
  }

  updateQuiz(
    courseId: string,
    sectionId: string,
    quizId: string,
    data: Partial<QuizPayload>
  ): Promise<ApiResponse<Quiz>> {
    return this.patch<ApiResponse<Quiz>>(
      `/${courseId}/sections/${sectionId}/quizzes/${quizId}`,
      data
    );
  }

  updateSection(
    courseId: string,
    sectionId: string,
    data: Partial<SectionPayload>
  ): Promise<ApiResponse<Section>> {
    return this.patch<ApiResponse<Section>>(`/${courseId}/sections/${sectionId}`, data);
  }

  // Static factory for SSR usage (pass a token getter or headers)
  static forSSR(token: string | undefined, refresh?: any) {
    return new CourseService(
      () => token,
      () => refresh()
    );
  }
}

// Singleton for client-side usage
export const courseService: ICourseService = new CourseService();
