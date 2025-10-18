'use client';

import { store } from '@/store';
import { refreshToken } from '@/store/slices/auth-slice';
import { AuthPlugin } from '../providers';

// const dispatch = useAppDispatch();

export const authRefreshToken = async () => {
  const response = await store.dispatch(refreshToken());
  if (
    response.meta.requestStatus === 'rejected' ||
    !(response.payload as { success: boolean; message: string })?.success
  ) {
    throw new Error((response.payload as { success: boolean; message: string })?.message);
  }

  return { token: (response.payload as { data: { token: string } })?.data?.token };
};

export function createAuthPlugin(): AuthPlugin {
  return {
    refreshToken: () => authRefreshToken(),
  };
}

export const getClientAuthToken = () => store?.getState()?.auth?.token;

export const triggerClientRefresh = async () => {
  await store?.dispatch(refreshToken());
};
