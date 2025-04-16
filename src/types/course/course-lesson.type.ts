export interface Lesson {
  id: string;
  sectionId: string;
  title: string;
  description: string;
  content: string;
  contentType: 'video' | 'document' | 'text';
  videoUrl?: string;
  duration?: number;
  order: number;
  isPreview: boolean;
  createdAt: string;
  updatedAt: string;
}
