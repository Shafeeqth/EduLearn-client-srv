'use client';

import React from 'react';
import { QueryClient, QueryCache, MutationCache, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store';
import {
  persistQueryClient,
  PersistQueryClientProvider,
} from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { compress, decompress } from 'lz-string';
import { restoreCredentials } from '@/store/slices/auth-slice';

// Auth Plugin Interface
export interface AuthPlugin {
  refreshToken: () => Promise<{ token: string }>; // Returns true if refresh succeeded
}

type ProvidersProps = {
  children: React.ReactNode;
  authPlugin?: AuthPlugin;
};

const STALE_TIME = {
  short: 30 * 1000, // 30 seconds - frequently changing data
  medium: 5 * 60 * 1000, // 5 minutes - moderate changes
  long: 15 * 60 * 1000, // 15 minutes - rarely changing data
  extraLong: 30 * 60 * 1000, // 30 minutes - very stable data
} as const;

const GC_TIME = {
  short: 5 * 60 * 1000, // 5 minutes
  medium: 10 * 60 * 1000, // 10 minutes
  long: 30 * 60 * 1000, // 30 minutes
  extraLong: 60 * 60 * 1000, // 1 hour
} as const;

// Global error handler with auth refresh
function createGlobalErrorHandler(authPlugin?: AuthPlugin) {
  const handledQueries = new Set<string>();

  return async (error: any, query?: any) => {
    const status = error?.response?.status || error?.status;

    // Log errors for monitoring
    if (process.env.NODE_ENV === 'development') {
      console.error('Query/Mutation Error:', error);
    }

    // Handle auth errors globally
    if (status === 401 && authPlugin && query) {
      const queryKey = query.queryKey?.join('-') || 'unknown';

      // Prevent multiple refresh attempts for the same query
      if (handledQueries.has(queryKey)) {
        return;
      }

      handledQueries.add(queryKey);

      try {
        const refreshSucceeded = await authPlugin.refreshToken();

        if (refreshSucceeded) {
          // Invalidate and refetch the failed query
          query.fetch();
        }
      } catch (refreshError) {
        console.error('Auth refresh failed:', refreshError);
      } finally {
        // Clean up after some time to allow future refresh attempts
        setTimeout(() => {
          handledQueries.delete(queryKey);
        }, 5000);
      }
    }
  };
}

let isRefreshing = false;

export function StateProviders({ children, dehydratedState, authPlugin }: ProvidersProps) {
  const [queryClient] = React.useState(() => {
    const errorHandler = createGlobalErrorHandler(authPlugin);

    return new QueryClient({
      queryCache: new QueryCache({
        onError: (error, query) => errorHandler(error, query),
      }),
      mutationCache: new MutationCache({
        onError: (error) => errorHandler(error),
      }),
      defaultOptions: {
        queries: {
          staleTime: STALE_TIME.medium,
          gcTime: GC_TIME.medium,
          retry:
            false &&
            ((failureCount, error: any) => {
              const status = error?.response?.status || error?.status;

              // Handle 401 with auth refresh
              if (status === 401 && authPlugin && !isRefreshing && failureCount === 0) {
                isRefreshing = true;
                authPlugin
                  .refreshToken()
                  .then((success) => {
                    if (success) {
                      // Invalidate all queries to refetch with new token
                      queryClient.invalidateQueries();
                    }
                  })
                  .catch(console.error)
                  .finally(() => {
                    isRefreshing = false;
                  });
                return false; // Don't retry immediately, wait for invalidation
              }

              // Don't retry client errors (4xx) except 408 (timeout)
              if (status >= 400 && status < 500 && status !== 408) {
                return false;
              }

              // Retry network errors and 5xx up to 2 times
              return failureCount < 2;
            }),
          retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
          refetchOnWindowFocus: false,
          refetchOnReconnect: 'always',
          refetchOnMount: true,
          // Network mode for better offline handling
          networkMode: 'online',
        },
        mutations: {
          retry: (failureCount, error: any) => {
            const status = error?.response?.status || error?.status;

            // Handle 401 for mutations
            if (status === 401 && authPlugin && !isRefreshing) {
              isRefreshing = true;
              authPlugin
                .refreshToken()
                .catch(console.error)
                .finally(() => {
                  isRefreshing = false;
                });
            }

            return false; // Don't retry mutations by default
          },
          retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
          networkMode: 'online',
        },
      },
    });
  });

  const localStoragePersister = React.useMemo(() => {
    // Only create persister on client side
    if (typeof window === 'undefined') return undefined;

    return createSyncStoragePersister({
      key: 'EDULEARN_OFFLINE_CACHE',
      storage: window.localStorage,
      throttleTime: 1000,
      serialize: (data) => {
        try {
          return compress(JSON.stringify(data));
        } catch (error) {
          console.error('Failed to serialize cache data:', error);
          return '';
        }
      },
      deserialize: (data) => {
        try {
          return JSON.parse(decompress(data) || '{}');
        } catch (error) {
          console.error('Failed to deserialize cache data:', error);
          return {};
        }
      },
    });
  }, []);

  // Hydrate Redux state from localStorage (client-side only)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      store.dispatch(restoreCredentials());
    }
  }, []);

  // Setup query client persistence (client-side only)
  React.useEffect(() => {
    if (!localStoragePersister) return;

    const persistOptions = {
      queryClient,
      persister: localStoragePersister,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      buster: 'v1', // Increment when cache structure changes
      dehydrateOptions: {
        shouldDehydrateQuery: (query: any) => {
          const { state, queryKey } = query;

          // Only persist successful queries
          if (state.status !== 'success') return false;

          // Don't persist sensitive data
          const sensitiveKeys = ['session', 'user', 'auth', 'token'];
          if (sensitiveKeys.some((key) => queryKey.includes(key))) return false;

          // Don't persist real-time data
          const realtimeKeys = ['notification', 'chat', 'live'];
          if (realtimeKeys.some((key) => queryKey.includes(key))) return false;

          return true;
        },
      },
    };

    const [, persistPromise] = persistQueryClient(persistOptions);
    persistPromise.catch((error) => {
      console.error('Failed to setup query client persistence:', error);
    });
  }, [queryClient, localStoragePersister]);

  const Provider = typeof window === 'undefined' ? QueryClientProvider : PersistQueryClientProvider;

  // For SSR compatibility
  // Always provide QueryClient, server or client
  const providerProps: any =
    typeof window === 'undefined'
      ? { client: queryClient }
      : { client: queryClient, persistOptions: { persister: localStoragePersister! } };

  // Client-side render with persistence
  return (
    <Provider {...providerProps}>
      <ReduxProvider store={store}>
        {children}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
        )}
      </ReduxProvider>
    </Provider>
  );
}
