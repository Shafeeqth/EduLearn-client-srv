export type BasicInfoRequestPayload = {
  courseId?: string;
  title: string;
  durationValue: string;
  durationUnit: string;
  category: string;
  subCategory: string;
  instructorId?: string;
  topics?: string[];
  language: string;
  level: string;
  price: number;
  discountPrice?: number;
  currency?: string;
  subtitle?: string | undefined;
  subtitleLanguage?: string | undefined;
};

export type AdvancedInfoRequestPayload = {
  description: string;
  learningOutcomes: string[];
  targetAudience: string[];
  requirements: string[];
  thumbnail?: string;
  trailer?: string;
};

export type CourseData = BasicInfoRequestPayload &
  AdvancedInfoRequestPayload & { status: 'published' | 'draft' | 'deleted'; publishedAt: Date };

export type Quiz = {
  id: string;
  title: string;
  questions: QuizQuestion[];
  passingScore: number;
  maxAttempts: number;
  randomizeQuestions: boolean;
  showResults: boolean;
  isRequired: boolean;
  description?: string | undefined;
  timeLimit?: number | undefined;
};

export type CurriculumRequestPayload = {
  sections: Section[];
  totalDuration?: number | undefined;
  totalLessons?: number | undefined;
  totalQuizzes?: number | undefined;
};

type Content = {
  title: string;
  type: 'video' | 'document' | 'slides' | 'audio' | 'quiz' | 'assignment' | 'link';
  id: string;
  isRequired: boolean;
  isPreview: boolean;
  order: number;
  duration?: number | undefined;
  description?: string | undefined;
  quiz?: Quiz | undefined;
  file?: ContentFile | undefined;
  url?: string | undefined;
  metadata?: Record<string, string> | undefined;
};

export type QuizQuestion = {
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  id: string;
  question: string;
  points: number;
  required: boolean;
  options?:
    | {
        id: string;
        text: string;
        isCorrect: boolean;
      }[]
    | undefined;
  correctAnswer?: string | undefined;
  explanation?: string | undefined;
  timeLimit?: number | undefined;
};

type ContentFile = {
  id: string;
  name: string;
  type: 'video' | 'document' | 'slides' | 'audio' | 'captions' | 'transcript';
  file?: File | undefined;
  url?: string | undefined;
  s3Upload?:
    | {
        status: 'idle' | 'uploading' | 'processing' | 'completed' | 'failed';
        url: string;
        key: string;
        bucket: string;
        presignedUrl?: string | undefined;
        progress?:
          | {
              loaded: number;
              total: number;
              percentage: number;
              speed?: number | undefined;
              eta?: number | undefined;
            }
          | undefined;
        error?: string | undefined;
      }
    | undefined;
  size?: number | undefined;
  duration?: number | undefined;
  mimeType?: string | undefined;
  thumbnail?: string | undefined;
  metadata?: Record<string, string> | undefined;
};

type Lesson = {
  id: string;
  name: string;
  isPublished: boolean;
  order: number;
  content: Content;
  learningObjectives: string[];
  description?: string | undefined;
  estimatedDuration?: number | undefined;
};

type Section = {
  id: string;
  name: string;
  order: number;
  isPublished: boolean;
  lessons: Lesson[];
  description?: string | undefined;
  quiz?: Quiz | undefined;
};
