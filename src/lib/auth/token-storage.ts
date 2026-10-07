/**
 * Persistence for the parts of a session that must survive a reload.
 *
 * - The access token is NEVER persisted: it only lives in memory
 *   (session-store) so an XSS payload cannot lift it from storage.
 * - The refresh token is persisted only with the `body` strategy. With the
 *   recommended `cookie` strategy the backend keeps it in an httpOnly cookie
 *   and the browser never exposes it to JS.
 * - A non-sensitive "session hint" tells the app whether trying a silent
 *   refresh on boot is worth a network round-trip.
 */

const REFRESH_TOKEN_KEY = 'menutrua.refresh-token';
const SESSION_HINT_KEY = 'menutrua.has-session';

function safe<T>(fn: () => T, fallback: T): T {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

function storageFor(remember: boolean): Storage {
  return remember ? window.localStorage : window.sessionStorage;
}

export const tokenStorage = {
  getRefreshToken(): string | null {
    return safe(
      () =>
        window.localStorage.getItem(REFRESH_TOKEN_KEY) ??
        window.sessionStorage.getItem(REFRESH_TOKEN_KEY),
      null,
    );
  },

  /** `remember` keeps the session across browser restarts. */
  setRefreshToken(token: string, remember: boolean): void {
    safe(() => {
      this.clearRefreshToken();
      storageFor(remember).setItem(REFRESH_TOKEN_KEY, token);
    }, undefined);
  },

  /** Replaces a rotated refresh token in whichever storage held the old one. */
  rotateRefreshToken(token: string): void {
    safe(() => {
      const remember = window.localStorage.getItem(REFRESH_TOKEN_KEY) !== null;
      storageFor(remember).setItem(REFRESH_TOKEN_KEY, token);
    }, undefined);
  },

  clearRefreshToken(): void {
    safe(() => {
      window.localStorage.removeItem(REFRESH_TOKEN_KEY);
      window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    }, undefined);
  },

  hasSessionHint(): boolean {
    return safe(
      () =>
        window.localStorage.getItem(SESSION_HINT_KEY) === '1' ||
        window.sessionStorage.getItem(SESSION_HINT_KEY) === '1',
      false,
    );
  },

  setSessionHint(remember: boolean): void {
    safe(() => {
      this.clearSessionHint();
      storageFor(remember).setItem(SESSION_HINT_KEY, '1');
    }, undefined);
  },

  clearSessionHint(): void {
    safe(() => {
      window.localStorage.removeItem(SESSION_HINT_KEY);
      window.sessionStorage.removeItem(SESSION_HINT_KEY);
    }, undefined);
  },

  clearAll(): void {
    this.clearRefreshToken();
    this.clearSessionHint();
  },
};
