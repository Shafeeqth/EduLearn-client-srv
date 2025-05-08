import { useAppDispatch, useAppSelector } from '@/store';
import { clearError as handleClearError, register } from '@/store/slices/auth-slice';
import { RegisterData } from '@/types/auth/register-user.type';
import { RegisterSchemaType } from '../_schemas/register-schema';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { AuthType } from '@/types/user/user.type';

export const useRegister = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { error, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  const handleSubmit = async (credentials: RegisterSchemaType) => {
    const registerCredentials: RegisterData = {
      // confirmPassword: credentials.confirmPassword,
      email: credentials.email,
      username: credentials.username,
      password: credentials.password,
      avatar: '/fallback-avatar.jpg',
      role: 'user',
      authType: AuthType.EMAIL,
    };
    const result = await dispatch(register(registerCredentials));

    // If everything gone smoothly (not error)
    if (result.meta.requestStatus === 'rejected') {
      toast.error((result.payload as string).toString() || 'Registration failed. please try again');
      return;
    }
    toast.success('OTP send', { className: 'text-center' });
    router.push(`/verify/?email=${credentials.email}`);
  };

  const clearError = () => dispatch(handleClearError());

  return { error, isAuthenticated, isLoading, handleSubmit, clearError };
};
