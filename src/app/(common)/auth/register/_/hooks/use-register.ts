import { useAppDispatch, useAppSelector } from '@/store';
import { clearError as handleClearError, register } from '@/store/slices/auth-slice';
import { RegisterData } from '@/types/auth/register-user.type';
import { useRouter } from 'next/navigation';
import { AuthType } from '@/types/user/user.type';
import { SignupFormData } from '../schemas';
import { useToast } from '@/hooks/use-toast';

export const useRegister = () => {
  const dispatch = useAppDispatch();
  const { common, toast } = useToast();
  const router = useRouter();
  const { error, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  const handleSubmit = async (data: SignupFormData) => {
    try {
      const registerCredentials: RegisterData = {
        // confirmPassword: credentials.confirmPassword,
        ...data,
        avatar: '',
        role: 'student',
        authType: AuthType.EMAIL,
      };
      const result = await dispatch(register(registerCredentials));
      console.log(JSON.stringify(result, null, 2));

      if (result.meta.requestStatus === 'rejected') {
        common.registerError(result.payload as string);
        return;
      }

      toast.success({
        title: 'OTP has sent',
        description: 'Please check your registered email address.',
      });

      // Redirect to email verification page
      router.push(
        `/auth/verify/?email=${data.email}&name=${data.firstName}&_id=${(result.payload as { data: { userId: string } }).data.userId}`
      );
    } catch (error) {
      if (error instanceof Error) {
        toast.error({ title: error.message });
        return;
      }
    }
  };

  const clearError = () => dispatch(handleClearError());

  return { error, isAuthenticated, isLoading, handleSubmit, clearError };
};
