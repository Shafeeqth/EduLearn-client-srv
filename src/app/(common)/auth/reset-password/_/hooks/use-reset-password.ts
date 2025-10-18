import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { ResetPasswordFormData } from '../schemas';
import { authService } from '@/services/auth.service';
import { getErrorMessage } from '@/lib/utils';

export function useResetPassword(token: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean>(true);
  const router = useRouter();

  // Validate token on component mount

  const onSubmit = async ({ confirmPassword, password }: ResetPasswordFormData) => {
    if (!token) {
      toast.error('Invalid reset token');
      return;
    }

    setIsLoading(true);
    setTokenValid(true);

    try {
      await authService.resetPassword({ token, confirmPassword, password });

      toast.success('Password reset successfully!', {
        description: 'You can now sign in with your new password.',
        duration: 5000,
      });

      // Redirect to login page after successful reset
      setTimeout(() => {
        router.push('/auth/login?message=password-reset-success');
      }, 2000);
    } catch (error) {
      setTokenValid(false);
      toast.error('Failed to reset password', {
        description: getErrorMessage(error, 'Please try again or request a new reset link.'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { onSubmit, isLoading, tokenValid };
}
