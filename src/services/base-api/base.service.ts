import { config } from '@/lib/config';
import { v4 as uuidv4 } from 'uuid';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
} from 'axios';

/**
 * Optional hooks for logging, tracing, or metrics.
 */
export interface BaseServiceHooks {
  onRequest?: (config: InternalAxiosRequestConfig) => void;
  onResponse?: (response: AxiosResponse) => void;
  onError?: (error: AxiosError) => void;
}

export interface BaseServiceOptions {
  /**
   * Function to get the current access token (for Authorization header)
   */
  getToken?: () => string | null;
  /**
   * Optional: Function to refresh token if accessToken expired
   */
  authRefresh?: () => Promise<{ token: string }> | null;
  /**
   * Optional: Provide custom headers (for SSR, cookies, etc.)
   */
  getHeaders?: () => Record<string, string>;
  /**
   * Optional: Provide a custom Axios instance (for testing/mocking)
   */
  axiosInstance?: AxiosInstance;
  /**
   * Optional: Hooks for logging/tracing
   */
  hooks?: BaseServiceHooks;
  /**
   * Optional: Retry count for failed requests
   */
  retry?: number;
}

function hasErrorMessage(obj: unknown): obj is { error: { message: string } } {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'error' in obj &&
    typeof (obj as { error?: unknown }).error === 'object' &&
    (obj as { error: { message?: unknown } }).error !== null &&
    'message' in (obj as { error: { message?: unknown } }).error &&
    typeof (obj as { error: { message?: unknown } }).error.message === 'string'
  );
}

function hasMessage(obj: unknown): obj is { message: string } {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'message' in obj &&
    typeof (obj as { message?: unknown }).message === 'string'
  );
}

export abstract class BaseService {
  protected readonly client: AxiosInstance;
  protected readonly baseURL: string;
  protected readonly getToken?: () => string | null;
  protected readonly authRefresh?: () => Promise<{ token: string }> | null;
  protected readonly getHeaders?: () => Record<string, string>;
  protected readonly hooks?: BaseServiceHooks;
  protected readonly retry: number;
  private isRefreshing: boolean = false;
  /* Queue to store failed request while refresh token triggers */
  private failedQueue: Array<(token: string) => Promise<unknown>> = [];

  constructor(baseURL: string, options: BaseServiceOptions = {}) {
    this.baseURL = baseURL;
    this.getToken = options.getToken;
    this.getHeaders = options.getHeaders;
    this.authRefresh = options.authRefresh;
    this.hooks = options.hooks;
    this.retry = options.retry ?? 3;

    this.client =
      options.axiosInstance ||
      axios.create({
        baseURL: baseURL || config.apiUrl,
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

    this._initializeInterceptors();
  }

  private _initializeInterceptors(): void {
    this.client.interceptors.request.use(
      (config) => {
        // Inject Authorization header if token is available
        if (this.getToken) {
          const token = this.getToken();
          if (token) {
            config.headers = (config.headers || {}) as AxiosRequestHeaders;
            config.headers['Authorization'] = `Bearer ${token}`;
          }
        }

        // Inject idempotency-key for applicable methods
        const method = config.method?.toLowerCase();
        const idempotentMethods = ['post', 'patch'];

        if (idempotentMethods.includes(method!)) {
          config.headers['Idempotency-Key'] = uuidv4();
        }

        // For request tracing
        config.headers['X-Request-ID'] = config?.headers?.['X-Request-ID'] || uuidv4();

        // Inject custom headers (SSR, cookies, etc.)
        if (this.getHeaders) {
          const headers = this.getHeaders();
          config.headers = { ...(config.headers as object), ...headers } as AxiosRequestHeaders;
        }
        this.hooks?.onRequest?.(config);
        return config;
      },
      (error) => {
        this.hooks?.onError?.(error);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        this.hooks?.onResponse?.(response);
        return response;
      },
      async (err: AxiosError) => {
        const originalRequest = err.config as AxiosRequestConfig & {
          _retryCount?: number;
          _retry?: boolean;
        };

        // Handle 401 Unauthorized
        if (err.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve) => {
              this.failedQueue.push(async (token: string) => {
                originalRequest.headers!['Authorization'] = `Bearer ${token}`;
                resolve(this.client(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          if (this.authRefresh) {
            try {
              this.isRefreshing = true;
              const { token } = await this.authRefresh()!;
              this.isRefreshing = false;
              console.error('auth token ' + token);

              if (!token) {
                throw new Error('No token returned from refresh');
              }

              await this.processFailed(token);

              originalRequest.headers = {
                ...(originalRequest.headers || {}),
                Authorization: `Bearer ${token}`,
              };

              return this.client(originalRequest); // retry request
            } catch (refreshError) {
              this.isRefreshing = false;
              // window.location.href = '/auth/login?expired=true';
              return Promise.reject(refreshError);
            }
          }
        }

        // Retry logic for network/5xx with exponential backoff
        originalRequest._retryCount = originalRequest._retryCount || 0;
        if (
          this.retry > 0 &&
          originalRequest._retryCount < this.retry &&
          (!err.response || err.response.status >= 500)
        ) {
          originalRequest._retryCount += 1;

          // exponential backoff delay with jitter
          const delay = this.getExponentialBackoffDelay(originalRequest._retryCount);

          return new Promise((resolve) => {
            setTimeout(() => resolve(this.client(originalRequest)), delay);
          });
        }

        this.hooks?.onError?.(err);
        return Promise.reject(this._handleError(err));
      }
    );
  }

  /**
   * Improved error handler: returns user-friendly, typed errors
   */
  private _handleError(error: AxiosError): Error {
    if (error.response) {
      const { status } = error.response;
      const data: unknown = error.response.data;
      let message = error.message || 'Server error occurred';
      if (hasErrorMessage(data)) {
        message = data.error.message;
      } else if (hasMessage(data)) {
        message = data.message;
      }
      switch (status) {
        case 400:
          message = message || 'Invalid request data';
          break;
        case 401:
          message = 'Authentication required. Please login again.';
          break;
        case 403:
          message = 'You do not have permission to perform this action.';
          break;
        case 404:
          message = 'Resource not found.';
          break;
        case 429:
          message = 'Too many requests. Please try again later.';
          break;
        case 500:
          message = 'Server error. Please try again later.';
          break;
        default:
          break;
      }
      return new Error(message);
    } else if (error.request) {
      return new Error('No response received from server. Please check your connection.');
    } else {
      return new Error(error.message || 'An unexpected error occurred.');
    }
  }

  /**
   * Generic GET request
   */
  protected async get<T>(
    url: string,
    config?: AxiosRequestConfig,
    signal?: AbortSignal
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.get(url, { ...config, signal });
      return response.data;
    } catch (error) {
      throw this._handleError(error as AxiosError);
    }
  }

  /**
   * Generic POST request (supports JSON and FormData)
   */
  protected async post<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
    signal?: AbortSignal
  ): Promise<T> {
    try {
      const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
      const headers = isFormData ? { 'Content-Type': 'multipart/form-data' } : {};
      const response: AxiosResponse<T> = await this.client.post(url, data, {
        ...config,
        headers: { ...headers, ...(config?.headers || {}) },
        signal,
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error as AxiosError);
    }
  }

  /**
   * Generic PATCH request
   */
  protected async patch<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
    signal?: AbortSignal
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.patch(url, data, { ...config, signal });
      return response.data;
    } catch (error) {
      throw this._handleError(error as AxiosError);
    }
  }

  /**
   * Generic PUT request
   */
  protected async put<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
    signal?: AbortSignal
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.put(url, data, { ...config, signal });
      return response.data;
    } catch (error) {
      throw this._handleError(error as AxiosError);
    }
  }

  /**
   * Generic DELETE request
   */
  protected async delete<T>(
    url: string,
    config?: AxiosRequestConfig,
    signal?: AbortSignal
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.delete(url, { ...config, signal });
      return response.data;
    } catch (error) {
      throw this._handleError(error as AxiosError);
    }
  }

  /**
   * Download file as blob
   */
  protected async download(
    url: string,
    config?: AxiosRequestConfig,
    signal?: AbortSignal
  ): Promise<Blob> {
    try {
      const response = await this.client.get(url, { ...config, responseType: 'blob', signal });
      return response.data;
    } catch (error) {
      throw this._handleError(error as AxiosError);
    }
  }

  /**
   * Exponential backoff with jitter
   * retry #1 → ~500ms
   * retry #2 → ~1000ms
   * retry #3 → ~2000ms
   */
  private getExponentialBackoffDelay(
    retryCount: number,
    baseDelay = 1000,
    maxDelay = 10000
  ): number {
    const delay = Math.min(baseDelay * Math.pow(2, retryCount - 1), maxDelay);
    const jitter = Math.random() * 0.3 * delay; // 0–30% jitter
    return delay + jitter;
  }

  private async processFailed(token: string) {
    await Promise.all(this.failedQueue.map((cb) => cb(token)));
    this.failedQueue = [];
  }
}
