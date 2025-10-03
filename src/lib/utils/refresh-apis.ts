import { AuthResponse } from '@/types/auth';

import { apiClient } from './api';
import { ApiResponse } from '@/types/api-response';

export const refreshApi = async () => {
  const maxRetries = 3;
  let attempt = 0;
  let lastError;
  while (attempt < maxRetries) {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        '/auth/refresh',
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          withCredentials: true,
        }
      );
      return response;
    } catch (error) {
      lastError = error;
      attempt++;
      if (attempt < maxRetries) {
        // Exponential backoff: 100ms, 200ms, 400ms
        await new Promise((res) => setTimeout(res, 100 * Math.pow(2, attempt - 1)));
      }
    }
  }
  throw lastError;
};
