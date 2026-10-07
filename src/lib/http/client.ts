import axios, {isCancel, type AxiosError, type InternalAxiosRequestConfig} from 'axios';
import {env} from '@/config/env';
import {expireSession, isAuthFailure, refreshAccessToken} from '@/lib/auth/session';
import {getAccessToken, isAccessTokenExpiring} from '@/lib/auth/session-store';
import {toApiError} from './api-error';
import {AUTH_BYPASS_PATHS} from './endpoints';

/** Requests already replayed once after a refresh (never retried twice). */
const retriedRequests = new WeakSet<InternalAxiosRequestConfig>();

const leewayMs = env.auth.refreshLeewaySeconds * 1000;

const isAuthBypass = (url = '') => AUTH_BYPASS_PATHS.some((path) => url.endsWith(path));

/**
 * Shared API client. Every feature `api.ts` goes through it, so auth
 * headers, refresh-and-retry and error normalisation live in one place.
 */
export const http = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeout,
  // Cookie strategy: the httpOnly refresh cookie must ride along.
  withCredentials: env.auth.refreshStrategy === 'cookie',
  headers: {Accept: 'application/json'},
});

// Attach the access token; refresh it first if it is about to expire.
http.interceptors.request.use(async (config) => {
  if (isAuthBypass(config.url)) return config;

  let token = getAccessToken();
  if (token && isAccessTokenExpiring(leewayMs)) {
    token = await refreshAccessToken().catch(() => token);
  }
  if (token) config.headers.set('Authorization', `Bearer ${token}`);
  return config;
});

// On 401: refresh once (shared across concurrent requests) and replay.
http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (isCancel(error)) throw error;

    const original = error.config;
    const shouldRefresh =
      error.response?.status === 401 &&
      original !== undefined &&
      !retriedRequests.has(original) &&
      !isAuthBypass(original.url);

    if (!shouldRefresh) throw toApiError(error);

    retriedRequests.add(original);
    let token: string;
    try {
      token = await refreshAccessToken();
    } catch (refreshError) {
      if (isAuthFailure(refreshError)) expireSession();
      throw toApiError(error);
    }
    original.headers.set('Authorization', `Bearer ${token}`);
    return http(original);
  },
);
