import { useCallback, useState } from 'react';
import { useAppDispatch } from '@/store';
import { checkEmail } from '@/store/slices/auth-slice';
import { useDebounce } from '@/hooks/use-debounce';

export default function useEmailCheck() {
  const [emailStatus, setEmailStatus] = useState<{
    status: 'available' | 'already-exist' | 'error';
    message: string;
  } | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const dispatch = useAppDispatch();

  // Debounced function to check email
  const emailCheck = useCallback(
    useDebounce(async (email: string, isEmailValid: boolean) => {
      if (!email || isEmailValid) return;

      try {
        setIsCheckingEmail(true);
        const response = await dispatch(checkEmail({ email }));
        console.log(response);

        if (response.meta.requestStatus === 'fulfilled') {
          setEmailStatus({ status: 'already-exist', message: 'Email already exists' });
        } else {
          setEmailStatus({ status: 'available', message: 'Email is available' });
        }
      } catch (error) {
        if (error instanceof Error) {
          setEmailStatus({ status: 'error', message: error.message || 'Error check email' });
        }
      } finally {
        setIsCheckingEmail(false);
      }
    }, 1000), // 1000ms debounce
    [useDebounce]
  );

  return { emailCheck, isCheckingEmail, emailStatus, setEmailStatus, setIsCheckingEmail };
}
