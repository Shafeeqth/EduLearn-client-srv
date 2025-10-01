import {
  CheckEmailRequest,
  CheckEmailResponse,
  LogoutCredential,
  PasswordChangeRequest,
  PasswordResetRequest,
  ResendOTPRequest,
  VerifyOTPRequest,
} from '@/types/auth';
import { LoginCredentials } from '@/types/auth/login-data.type';
import { Auth2SignData, AuthResponse, RegisterData } from '@/types/auth/register-user.type';
import { BaseService } from './base-api/base.service';
import { config } from '@/lib/config';
import { store } from '@/store';
import { ApiResponse } from '@/types/api-response';
import { refreshToken } from '@/store/slices/auth-slice';

export interface IAuthService {
  login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>>;
  register(userdata: RegisterData): Promise<ApiResponse<{ userId: string }>>;
  oauthSign(userdata: Auth2SignData): Promise<ApiResponse<AuthResponse>>;
  verify(verifyData: VerifyOTPRequest): Promise<ApiResponse<AuthResponse>>;
  resendOtp(verifyData: ResendOTPRequest): Promise<ApiResponse<AuthResponse>>;
  refreshToken(): Promise<ApiResponse<AuthResponse>>;
  logout(credential: LogoutCredential): Promise<ApiResponse<void>>;
  forgotPassword(email: string): Promise<ApiResponse<{ message: string }>>;
  resetPassword(data: PasswordResetRequest): Promise<ApiResponse<{ message: string }>>;
  changePassword(data: PasswordChangeRequest): Promise<ApiResponse<{ message: string }>>;
  checkEmail(data: CheckEmailRequest): Promise<ApiResponse<CheckEmailResponse>>;
}

// Token getter for client-side singleton
const getToken = () => store?.getState()?.auth?.token;

// Token getter for client-side singleton
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

class AuthService extends BaseService implements IAuthService {
  constructor(
    tokenGetter: () => string | null = getToken,
    refresh: () => Promise<AuthResponse> = authRefresh
  ) {
    super(`${config.apiUrl}/auth`, { getToken: tokenGetter, authRefresh: refresh });
  }

  public async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    return this.post<ApiResponse<AuthResponse>, LoginCredentials>('/login', credentials);
  }

  public async register(userdata: RegisterData): Promise<ApiResponse<{ userId: string }>> {
    return this.post<ApiResponse<{ userId: string }>, RegisterData>('/register', userdata);
  }

  public async oauthSign(userdata: Auth2SignData): Promise<ApiResponse<AuthResponse>> {
    return this.post<ApiResponse<AuthResponse>, Auth2SignData>('/oauth', userdata);
  }

  public async checkEmail(
    credentials: CheckEmailRequest
  ): Promise<ApiResponse<CheckEmailResponse>> {
    return this.post<ApiResponse<CheckEmailResponse>, CheckEmailRequest>(
      '/email-check',
      credentials
    );
  }

  public async verify(verifyData: VerifyOTPRequest): Promise<ApiResponse<AuthResponse>> {
    return this.post<ApiResponse<AuthResponse>, VerifyOTPRequest>('/verify', verifyData);
  }

  public async resendOtp(resendData: ResendOTPRequest): Promise<ApiResponse<AuthResponse>> {
    return this.post<ApiResponse<AuthResponse>, ResendOTPRequest>('/resend-otp', resendData);
  }

  public async logout(credential: LogoutCredential): Promise<ApiResponse<void>> {
    return this.post<ApiResponse<void>>('/logout', credential);
  }

  public async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    return this.post<ApiResponse<{ message: string }>>('/forgot-password', { email });
  }

  public async resetPassword(
    data: PasswordResetRequest
  ): Promise<ApiResponse<{ message: string }>> {
    return this.post<ApiResponse<{ message: string }>>('/reset-password', data);
  }

  public async changePassword(
    data: PasswordChangeRequest
  ): Promise<ApiResponse<{ message: string }>> {
    return this.post<ApiResponse<{ message: string }>>('/change-password', data);
  }

  public refreshToken(): Promise<ApiResponse<AuthResponse>> {
    return this.post<ApiResponse<AuthResponse>>('/refresh');
  }

  // Static factory for SSR usage (pass a token getter or headers)
  static forSSR(token: string | null) {
    return new AuthService(() => token);
  }
}

// Singleton for client-side usage
export const authService: IAuthService = new AuthService();
