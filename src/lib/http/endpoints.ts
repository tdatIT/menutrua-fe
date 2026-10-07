/**
 * Single source of truth for API paths (relative to `env.apiBaseUrl`).
 * The mock server registers handlers from the same map, so FE and mocks
 * cannot drift apart — the backend only has to honour these contracts.
 */
export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  public: {
    categories: '/public/categories',
    featuredDishes: '/public/featured-dishes',
    suggestion: '/public/suggestion',
    pollPreview: '/public/poll-preview',
  },
  dishes: {
    list: '/dishes',
    detail: (id: string) => `/dishes/${id}`,
    random: '/dishes/random',
  },
  polls: {
    current: '/polls/current',
    detail: (id: string) => `/polls/${id}`,
    random: (id: string) => `/polls/${id}/random`,
    entry: (id: string, entryId: string) => `/polls/${id}/entries/${entryId}`,
  },
} as const;

/** Endpoints that must never trigger the refresh-and-retry flow. */
export const AUTH_BYPASS_PATHS: readonly string[] = [
  endpoints.auth.login,
  endpoints.auth.register,
  endpoints.auth.refresh,
  endpoints.auth.logout,
];
