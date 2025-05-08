import { useAppDispatch } from '@/store';
import { login, register } from '@/store/slices/auth-slice';
import { LoginCredentials } from '@/types/auth/login-data.type';
import { RegisterData } from '@/types/auth/register-user.type';
import { AuthType } from '@/types/user/user.type';
import { DefaultUser } from 'next-auth';
import { toast } from 'sonner';

export function useAuth2() {
  const dispatch = useAppDispatch();

  const registerUserByAuth2 = async (user: DefaultUser) => {
    const registerCredentials: RegisterData = {
      email: user.email!,
      username: user.name!,
      avatar: user.image!,
      role: 'user',
      authType: AuthType.OAUTH_2,
    };
    const result = await dispatch(register(registerCredentials));

    // If everything gone smoothly (not error)
    if (result.meta.requestStatus === 'rejected') {
      toast.error((result.payload as string).toString() || 'Registration failed. please try again');
      return;
    }
    toast.success('OTP send', { className: 'text-center' });
  };
  const loginUserByAuth2 = async (user: DefaultUser) => {
    const loginCredentials: LoginCredentials = {
      email: user.email!,
      authType: AuthType.OAUTH_2,
    };
    const result = await dispatch(login(loginCredentials));

    // If everything gone smoothly (not error)
    if (result.meta.requestStatus === 'rejected') {
      toast.error((result.payload as string).toString() || 'Registration failed. please try again');
      return;
    }
    toast.success('OTP send', { className: 'text-center' });
  };
  //   const logoutUserByAuth2 = async (user: session) => {
  //     const loginCredentials: LoginCredentials = {
  //       email: user.email!,
  //       authType: AuthType.OAUTH_2,
  //     };
  //     const result = await dispatch(logout(loginCredentials));

  //     // If everything gone smoothly (not error)
  //     if (result.meta.requestStatus === 'rejected') {
  //       toast.error((result.payload as string).toString() || 'Registration failed. please try again');
  //       return;
  //     }
  //     toast.success('OTP send', { className: 'text-center' });
  //   };

  return { loginUserByAuth2, registerUserByAuth2 };
}
