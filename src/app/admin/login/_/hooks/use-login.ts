'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { adminLogin } from '@/store/slices/admin-slice';
import { AdminLoginSchemaType } from '../schemas';
import { useAppDispatch } from '@/store';
import { toast } from '@/hooks/use-toast';

export const useAdminLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const handleSubmit = async (credentials: AdminLoginSchemaType) => {
    const result = await dispatch(adminLogin(credentials));
    if (result.meta.requestStatus === 'rejected') {
      toast.error({ title: 'Admin login failed ', description: result.payload as string });
      return;
    }

    toast.success({ title: 'Admin login successful ' });

    const next = searchParams.get('next');
    router.replace(next ? next : `/admin`);
  };

  return { handleSubmit };
};
