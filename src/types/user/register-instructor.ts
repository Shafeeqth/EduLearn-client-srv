export interface RegisterInstructorPayload {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  country: string;
  city: string;
  expertise: string;
  experience: string;
  education: string;
  language: string;
  headline: string;
  bio: string;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
  linkedinUrl?: string | undefined;
  websiteUrl?: string | undefined;
  instagramUrl?: string | undefined;
  facebookUrl?: string | undefined;
  receiveUpdates?: boolean | undefined;
}
