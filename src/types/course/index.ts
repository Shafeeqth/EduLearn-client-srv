export * from './course.type';
export * from './course-review';
export * from './course-session.type';
export * from './course-lesson.type';

// export interface Course {
//   id: string;
//   title: string;
//   description: string;
//   thumbnail: string;
//   instructor: User;
//   rating: number;
//   ratingsCount: number;
//   price: number;
//   category: string;
//   level: 'beginner' | 'intermediate' | 'advanced';
//   duration: string;
//   lessonsCount: number;
// }

// export interface Course {
//   id: string;
//   title: string;
//   description: string;
//   shortDescription: string;
//   thumbnail: string;
//   instructor: {
//     id: string;
//     firstName: string;
//     lastName: string;
//     avatar: string;
//     title: string;
//     bio: string;
//     rating: number;
//     reviewsCount: number;
//     studentsCount: number;
//     coursesCount: number;
//   };
//   price: number;
//   originalPrice?: number;
//   discountPercentage?: number;
//   rating: number;
//   ratingsCount: number;
//   enrolledStudents: number;
//   duration: string;
//   lessonsCount: number;
//   level: 'Beginner' | 'Intermediate' | 'Advanced';
//   language: string;
//   category: string;
//   tags: string[];
//   syllabus: SyllabusSection[];
//   requirements: string[];
//   whatYouWillLearn: string[];
//   certification: {
//     provided: boolean;
//     description: string;
//   };
//   lastUpdated: Date;
//   createdAt: Date;
//   isEnrolled?: boolean;
//   isFavorited?: boolean;
// }

export interface SyllabusSection {
  id: string;
  title: string;
  lessonsCount: number;
  duration: string;
  lessons: Lesson[];
  isExpanded?: boolean;
}

// export interface Lesson {
//   id: string;
//   title: string;
//   duration: string;
//   type: 'video' | 'text' | 'quiz' | 'assignment';
//   isCompleted?: boolean;
//   isLocked?: boolean;
// }

export interface Review {
  id: string;
  userId: string;
  user: {
    name: string;
    avatar: string;
  };
  rating: number;
  comment: string;
  date: Date;
  helpful: number;
}

export interface Testimonial {
  id: string;
  user: {
    name: string;
    avatar: string;
    title: string;
  };
  content: string;
  rating: number;
}

export interface Instructor {
  id: string;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  totalReviews: number;
  totalStudents: number;
  totalCourses: number;
  experience: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  completed: boolean;
  type: 'lesson';
}

export interface LessonPayload {
  id: string;
  courseId: string | undefined;
  sectionId: string;
  isPreview: boolean | undefined;
  description: string | undefined;
  estimatedDuration: number | undefined;
  order: number | undefined;
  title: string;
  isPublished: boolean | undefined;
  contentType: 'video' | 'document' | 'slides' | 'audio' | 'quiz' | 'assignment' | 'link';
  contentUrl: string | undefined;
  metadata: {
    title: string;
    fileName: string | undefined;
    mimeType: string | undefined;
    fileSize: number | undefined;
    url: string | undefined;
  };
}

export interface Question {
  question: string;
  explanation: string | undefined;
  points: number | undefined;
  required: boolean | undefined;
  timeLimit: number | undefined;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  correctAnswer: number | undefined | string;
  options: string[] | undefined;
}

export type QuizPayload = {
  maxAttempts: number | undefined;
  showResults: boolean | undefined;
  description: string | undefined;
  isRequired: boolean | undefined;
  passingScore: number | undefined;
  title: string | undefined;
  questions: Question[];
};

// export type QuizPayload =
//   | {
//       courseId: string | undefined;
//       sectionId: string;
//       question: string;
//       explanation: string | undefined;
//       points: number | undefined;
//       required: boolean | undefined;
//       timeLimit: number | undefined;
//       type: 'multiple-choice';
//       correctAnswer: number | undefined;
//       options: string[] | undefined;
//     }
//   | {
//       courseId: string | undefined;
//       sectionId: string;
//       question: string;
//       correctAnswer: string | undefined;
//       explanation: string | undefined;
//       points: number | undefined;
//       required: boolean | undefined;
//       timeLimit: number | undefined;
//       type: 'true-false' | 'short-answer' | 'essay';
//       options?: undefined;
//     };

export interface Quiz {
  id: string;
  title: string;
  duration: string;
  questions: number;
  completed: boolean;
  score?: number;
  type: 'quiz';
}

export interface Section {
  id: string;
  title: string;
  items: (Lesson | Quiz)[];
}
export interface SectionPayload {
  title: string;
  description: string | undefined;
  order: number;
  isPublished: boolean | undefined;
}

// export interface Review {
//   id: string;
//   user: {
//     name: string;
//     avatar: string;
//   };
//   rating: number;
//   date: string;
//   comment: string;
// }

// export interface Course {
//   id: string;
//   title: string;
//   thumbnail: string;
//   description: string;
//   instructor: Instructor;
//   sections: Section[];
  
//   rating: number;
//   totalReviews: number;
//   totalStudents: number;
//   keyLearningObjectives: string[];

// }
