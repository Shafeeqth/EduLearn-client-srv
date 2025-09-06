import { useAppDispatch, useAppSelector } from '@/store';
import { clearError as handleClearError, login } from '@/store/slices/auth-slice';
import { SigninFormData } from '../schemas';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { LoginCredentials } from '@/types/auth/login-data.type';
import { AuthType } from '@/types/user/user.type';

export const useLogin = () => {
  const { common, toast } = useToast();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { error, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  const onSubmit = async (credentials: SigninFormData) => {
    const loginCredentials: LoginCredentials = {
      ...credentials,
      authType: AuthType.EMAIL,
    };

    try {
      // Simulate API call

      const result = await dispatch(login(loginCredentials));
      if (result.meta.requestStatus === 'rejected') {
        toast.error({ title: 'Login failed', description: result.payload as string });
        return;
      }

      common.loginSuccess();
      // 'Welcome back!', {
      //   description: 'You have successfully signed in to your account.',
      //   duration: 4000,
      // });

      // Redirect to HomePage

      router.push(`/`);
    } catch (error) {
      if (error instanceof Error) {
        toast.error({ title: error.message });
        return;
      }
      common.loginError('Please check your email and password and try again.');
    }
  };

  const clearError = () => dispatch(handleClearError());

  return { error, isAuthenticated, isLoading, onSubmit, clearError };
};
