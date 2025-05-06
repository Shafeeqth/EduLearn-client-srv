import { useAppDispatch, useAppSelector } from '@/store';
import { clearError as handleClearError, login } from '@/store/slices/auth-slice';
import { LoginSchemaType } from '../_schemas/';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { LoginCredentials } from '@/types/auth/login-data.type';
import { AuthType } from '@/types/user/user.type';

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { error, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  const handleSubmit = async (credentials: LoginSchemaType) => {
    const loginCredentials: LoginCredentials = {
      email: credentials.email,
      password: credentials.password,
      authType: AuthType.EMAIL,
    };
    const result = await dispatch(login(loginCredentials));

    // If everything gone smoothly (not error)
    if (result.meta.requestStatus === 'rejected') {
      toast.error((result.payload as string).toString() || 'Registration failed. please try again');
      return;
    }
    toast.success('Login successful', { className: 'text-center' });
    router.push(`/`);
  };

  const clearError = () => dispatch(handleClearError());

  return { error, isAuthenticated, isLoading, handleSubmit, clearError };
};
