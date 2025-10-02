import { RegisterInstructorPayload, User, UserProfileUpdatePayload } from '@/types/user';
import { BaseService } from './base-api/base.service';
import { config } from '@/lib/config';
import { AuthResponse } from '@/types/auth';
import { ApiResponse } from '@/types/api-response';
import { authRefreshToken, getClientAuthToken } from '@/lib/utils/auth-client-apis';

export interface IUserService {
  getCurrentUser(): Promise<ApiResponse<User>>;
  updateUserProfile(data: Partial<UserProfileUpdatePayload>): Promise<ApiResponse<User>>;
  registerInstructor(credential: RegisterInstructorPayload): Promise<ApiResponse<User>>;
  /**
   * Fetch all users
   */
  getUsers(): Promise<ApiResponse<User[]>>;
  getUser(userId: string): Promise<ApiResponse<User>>;
  /**
   * Block a user by ID
   */
  blockUser(userId: string): Promise<ApiResponse<void>>;
}

export class UserService extends BaseService implements IUserService {
  constructor(
    tokenGetter: () => string | null = getClientAuthToken,
    refresh: () => Promise<AuthResponse> = authRefreshToken
  ) {
    super(`${config.apiUrl}/users`, {
      getToken: tokenGetter,
      authRefresh: refresh,
    });
  }

  public async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.get<ApiResponse<User>>('/me');
  }

  public async updateUserProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return this.patch<ApiResponse<User>>('/me', data);
  }

  public async registerInstructor(
    credential: RegisterInstructorPayload
  ): Promise<ApiResponse<User>> {
    return this.post<ApiResponse<User>, RegisterInstructorPayload>(
      '/instructors/register',
      credential
    );
  }

  /**
   * Fetch all users
   */
  public async getUsers(): Promise<ApiResponse<User[]>> {
    return this.get<ApiResponse<User[]>>('/');
  }
  public async getUser(userId: string): Promise<ApiResponse<User>> {
    return this.get<ApiResponse<User>>(`/${userId}`);
  }

  /**
   * Block a user by ID
   */
  public async blockUser(userId: string): Promise<ApiResponse<void>> {
    return this.patch<ApiResponse<void>>(`/block/${userId}`);
  }

  // Static factory for SSR usage (pass a token getter or headers)
  static forSSR(token: string | null) {
    return new UserService(() => token);
  }
}

// Singleton for client-side usage
export const userService: IUserService = new UserService();
