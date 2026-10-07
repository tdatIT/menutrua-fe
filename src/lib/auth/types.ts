export type AuthUser = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
};

/**
 * Payload returned by /auth/login, /auth/register and /auth/refresh.
 * `refreshToken` is only present with the `body` refresh strategy; with
 * the `cookie` strategy the backend sets it as an httpOnly cookie instead.
 */
export type AuthSession = {
  accessToken: string;
  /** Access token lifetime in seconds. */
  expiresIn: number;
  refreshToken?: string;
  user: AuthUser;
};

export type SessionStatus = 'unknown' | 'authenticated' | 'anonymous';
