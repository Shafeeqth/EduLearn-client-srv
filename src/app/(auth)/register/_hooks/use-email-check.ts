import { useCallback, useState } from 'react';
import { debounce } from 'lodash';
import { useAppDispatch } from '@/store';
import { checkEmail } from '@/store/slices/auth-slice';

export default function useEmailCheck() {
  const [emailStatus, setEmailStatus] = useState<{
    status: 'available' | 'already-exist' | 'error';
    message: string;
  } | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const dispatch = useAppDispatch();

  // Debounced function to check email
  const emailCheck = useCallback(
    debounce(async (email: string) => {
      if (!email) return;

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
    []
  );

  return { emailCheck, isCheckingEmail, emailStatus, setEmailStatus, setIsCheckingEmail };
}
