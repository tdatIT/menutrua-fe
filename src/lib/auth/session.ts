import axios from 'axios';
import {env} from '@/config/env';
import {ApiError, toApiError} from '@/lib/http/api-error';
import {endpoints} from '@/lib/http/endpoints';
import {sessionStore} from './session-store';
import {tokenStorage} from './token-storage';
import type {AuthSession} from './types';

/**
 * Session lifecycle: establish, refresh (single-flight + cross-tab lock),
 * proactive refresh scheduling, expiry and cross-tab logout sync.
 */

const usesBodyStrategy = env.auth.refreshStrategy === 'body';
const leewayMs = env.auth.refreshLeewaySeconds * 1000;

/**
 * Bare client for /auth/refresh: it must not go through the main client's
 * interceptors, or a failing refresh would try to refresh itself.
 */
const refreshClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeout,
  withCredentials: !usesBodyStrategy,
});

type SessionEvent = 'expired' | 'logout';
const listeners = new Set<(event: SessionEvent) => void>();

export function onSessionEvent(listener: (event: SessionEvent) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function emit(event: SessionEvent) {
  listeners.forEach((listener) => listener(event));
}

// ---------------------------------------------------------------------------
// Cross-tab sync
// ---------------------------------------------------------------------------

type ChannelMessage = {type: 'logout'} | {type: 'login'};
const channel =
  typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel('menutrua:auth');

channel?.addEventListener('message', (event: MessageEvent<ChannelMessage>) => {
  if (event.data.type === 'logout') {
    clearLocalSession();
    emit('logout');
  } else if (event.data.type === 'login' && sessionStore.getState().status !== 'authenticated') {
    void bootstrapSession();
  }
});

/** Serialises refreshes across tabs so a rotated token is never reused. */
function withRefreshLock<T>(task: () => Promise<T>): Promise<T> {
  if (typeof navigator !== 'undefined' && navigator.locks) {
    return navigator.locks.request('menutrua:auth-refresh', task);
  }
  return task();
}

// ---------------------------------------------------------------------------
// Establish / clear
// ---------------------------------------------------------------------------

/** Called after login/register with the payload returned by the backend. */
export function establishSession(session: AuthSession, remember: boolean) {
  if (usesBodyStrategy && session.refreshToken) {
    tokenStorage.setRefreshToken(session.refreshToken, remember);
  }
  tokenStorage.setSessionHint(remember);
  sessionStore.getState().setSession(session);
  channel?.postMessage({type: 'login'} satisfies ChannelMessage);
}

function clearLocalSession() {
  tokenStorage.clearAll();
  sessionStore.getState().clearSession();
}

/** Refresh failed for good: drop the session and let the UI react. */
export function expireSession() {
  if (sessionStore.getState().status !== 'authenticated') {
    clearLocalSession();
    return;
  }
  clearLocalSession();
  emit('expired');
}

/** Explicit logout. Best-effort server revoke, local state always cleared. */
export async function endSession() {
  const refreshToken = tokenStorage.getRefreshToken();
  const accessToken = sessionStore.getState().accessToken;
  try {
    await refreshClient.post(endpoints.auth.logout, usesBodyStrategy ? {refreshToken} : {}, {
      headers: accessToken ? {Authorization: `Bearer ${accessToken}`} : {},
    });
  } catch {
    // Revocation is best-effort; the local session is cleared regardless.
  } finally {
    clearLocalSession();
    channel?.postMessage({type: 'logout'} satisfies ChannelMessage);
    emit('logout');
  }
}

// ---------------------------------------------------------------------------
// Refresh
// ---------------------------------------------------------------------------

let inflightRefresh: Promise<string> | null = null;

async function performRefresh(): Promise<string> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (usesBodyStrategy && !refreshToken) {
    throw new ApiError(401, {
      code: 'NO_REFRESH_TOKEN',
      message: 'Phiên đăng nhập đã hết hạn.',
    });
  }

  try {
    const {data} = await refreshClient.post<AuthSession>(
      endpoints.auth.refresh,
      usesBodyStrategy ? {refreshToken} : {},
    );
    if (usesBodyStrategy && data.refreshToken) {
      tokenStorage.rotateRefreshToken(data.refreshToken);
    }
    sessionStore.getState().setSession(data);
    return data.accessToken;
  } catch (error) {
    throw toApiError(error);
  }
}

/**
 * Single-flight refresh: concurrent 401s share one request instead of
 * stampeding /auth/refresh (which would also break token rotation).
 */
export function refreshAccessToken(): Promise<string> {
  inflightRefresh ??= withRefreshLock(performRefresh).finally(() => {
    inflightRefresh = null;
  });
  return inflightRefresh;
}

/** A refresh rejected by the server (vs. a network blip) ends the session. */
export function isAuthFailure(error: unknown): boolean {
  return error instanceof ApiError && [400, 401, 403].includes(error.status);
}

/** Restores a session on app start using the refresh token / cookie. */
export async function bootstrapSession(): Promise<void> {
  // With cookies the browser holds the token, so the hint is our only clue.
  if (!tokenStorage.hasSessionHint()) {
    sessionStore.getState().clearSession();
    return;
  }
  try {
    await refreshAccessToken();
  } catch {
    clearLocalSession();
  }
}

// ---------------------------------------------------------------------------
// Proactive refresh scheduling
// ---------------------------------------------------------------------------

let refreshTimer: ReturnType<typeof setTimeout> | undefined;

function scheduleRefresh(expiresAt: number | null) {
  clearTimeout(refreshTimer);
  if (expiresAt === null) return;
  const delay = Math.max(expiresAt - Date.now() - leewayMs, 0);
  refreshTimer = setTimeout(() => {
    refreshAccessToken().catch((error) => {
      if (isAuthFailure(error)) expireSession();
    });
  }, delay);
}

let schedulerStarted = false;

/**
 * Keeps the access token fresh in the background. Timers are throttled in
 * hidden tabs, so we also re-check when the tab becomes visible again.
 */
export function startSessionScheduler() {
  if (schedulerStarted) return;
  schedulerStarted = true;

  sessionStore.subscribe((state, previous) => {
    if (state.expiresAt !== previous.expiresAt) scheduleRefresh(state.expiresAt);
  });

  document.addEventListener('visibilitychange', () => {
    const {status, expiresAt} = sessionStore.getState();
    if (
      document.visibilityState === 'visible' &&
      status === 'authenticated' &&
      expiresAt !== null &&
      expiresAt - Date.now() <= leewayMs
    ) {
      scheduleRefresh(expiresAt);
    }
  });
}
