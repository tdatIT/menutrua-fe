import {createStore, useStore} from 'zustand';
import {resolveExpiry} from './jwt';
import type {AuthSession, AuthUser, SessionStatus} from './types';

type SessionState = {
  status: SessionStatus;
  user: AuthUser | null;
  /** In-memory only. Never written to storage. */
  accessToken: string | null;
  /** Absolute expiry of the access token, in ms since epoch. */
  expiresAt: number | null;
};

type SessionActions = {
  setSession: (session: AuthSession) => void;
  setUser: (user: AuthUser) => void;
  clearSession: () => void;
};

const initialState: SessionState = {
  status: 'unknown',
  user: null,
  accessToken: null,
  expiresAt: null,
};

/**
 * Framework-agnostic session store: the HTTP layer reads it outside React,
 * components subscribe through `useSession`.
 */
export const sessionStore = createStore<SessionState & SessionActions>()((set) => ({
  ...initialState,
  setSession: ({accessToken, expiresIn, user}) =>
    set({
      status: 'authenticated',
      user,
      accessToken,
      expiresAt: resolveExpiry(accessToken, expiresIn),
    }),
  setUser: (user) => set({user}),
  clearSession: () => set({...initialState, status: 'anonymous'}),
}));

export function useSession<T>(selector: (state: SessionState) => T): T {
  return useStore(sessionStore, selector);
}

export const getAccessToken = () => sessionStore.getState().accessToken;

/** True when the access token is missing or expires within `leewayMs`. */
export function isAccessTokenExpiring(leewayMs: number): boolean {
  const {expiresAt} = sessionStore.getState();
  return expiresAt === null || expiresAt - Date.now() <= leewayMs;
}
