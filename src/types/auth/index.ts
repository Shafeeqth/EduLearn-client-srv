export interface PasswordResetRequest {
  password: string;
  confirmPassword: string;
}

export interface PasswordChangeRequest extends PasswordResetRequest {}
