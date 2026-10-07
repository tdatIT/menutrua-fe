import {QueryClient} from '@tanstack/react-query';
import {ApiError} from '@/lib/http/api-error';

const NO_RETRY_STATUSES = new Set([400, 401, 403, 404, 409, 422]);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && NO_RETRY_STATUSES.has(error.status)) {
          return false;
        }
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
