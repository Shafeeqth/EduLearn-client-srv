
export * from './user.type';
export * from './register-instructor';

export enum UserStatus {
  VERIFIED = 'verified',
  NOT_VERIFIED = 'not-verified',
  ACTIVE = 'active',
  NOT_ACTIVE = 'not-active',
  BLOCKED = 'blocked',
}

export type Gender = 'male' | 'female' | 'other';

export interface UserProfile {
  bio?: string;
  phone?: string;
  country?: string;
  city?: string;
  gender?: Gender;
  preferences?: Record<string, string>;
  createdAt: Date;
}
export interface InstructorProfile {
  bio?: string;
  headline?: string;
  experience?: string;
  certificate?: string;
  expertise?: string[];
  tags?: string[];
  rating?: number;
  totalRatings?: number;
  totalCourses?: number;
  totalStudents?: number;
}

interface UserSocials {
  provider: string;
  profileUrl: string;
  providerUserId?: string;
}

export type User =
  | {
      id: string;
      email: string;
      role: 'student';
      status: UserStatus;
      firstName: string;
      lastName?: string;
      avatar?: string;
      lastLoginAt?: Date | undefined;
      profile?: UserProfile | undefined;
      socials?: UserSocials[];
      createdAt: Date;
      updatedAt?: Date;
    }
  | {
      id: string;
      email: string;
      role: 'instructor';
      status: UserStatus;
      firstName: string;
      lastName?: string;
      avatar?: string;
      lastLoginAt?: Date | undefined;
      profile?: UserProfile | undefined;
      instructorProfile?: InstructorProfile | undefined;
      socials?: UserSocials[];
      createdAt: Date;
      updatedAt?: Date;
    };

export interface UserProfileUpdatePayload {
  firstName: string;
  lastName?: string;
  biography?: string;
  language?: string;
  socials?: UserSocials[];
  city?: string;
  country?: string;
  phone?: string;
  avatar?: string;
  gender?: Gender;
}
