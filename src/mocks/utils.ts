import {delay, HttpResponse} from 'msw';
import {env} from '@/config/env';
import type {AuthSession} from '@/lib/auth/types';
import {db, newId, persist, type MockUser} from './db';

export const api = (path: string) => `${env.apiBaseUrl}${path}`;

export const latency = () => delay(env.mock.latencyMs);

export function errorResponse(
  status: number,
  code: string,
  message: string,
  fieldErrors?: Record<string, string>,
) {
  return HttpResponse.json({code, message, fieldErrors}, {status});
}

// ---------------------------------------------------------------------------
// Fake JWT (unsigned). Shape matches a real one so the FE decodes `exp`.
// ---------------------------------------------------------------------------

const base64Url = (value: string) =>
  btoa(String.fromCharCode(...new TextEncoder().encode(value)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

function signAccessToken(userId: string): string {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({alg: 'none', typ: 'JWT'}));
  const payload = base64Url(
    JSON.stringify({sub: userId, iat: now, exp: now + env.mock.accessTokenTtl}),
  );
  return `${header}.${payload}.mock-signature`;
}

function readAccessToken(token: string): {sub: string; exp: number} | null {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = new TextDecoder().decode(
      Uint8Array.from(atob(payload), (char) => char.charCodeAt(0)),
    );
    return JSON.parse(json) as {sub: string; exp: number};
  } catch {
    return null;
  }
}

export const REFRESH_COOKIE = 'mt_refresh';

export function publicUser(user: MockUser) {
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    avatarUrl: null,
  };
}

/** Issues a new access token + rotated refresh token for a user. */
export function issueSession(user: MockUser): AuthSession & {refreshToken: string} {
  const refreshToken = `rt_${newId()}`;
  db.refreshTokens[refreshToken] = {
    userId: user.id,
    expiresAt: Date.now() + env.mock.refreshTokenTtl * 1000,
    revoked: false,
  };
  persist();
  return {
    accessToken: signAccessToken(user.id),
    expiresIn: env.mock.accessTokenTtl,
    refreshToken,
    user: publicUser(user),
  };
}

/**
 * Builds the auth response for the configured strategy: refresh token in
 * the body, or in a cookie (MSW mirrors Set-Cookie into document.cookie).
 */
export function sessionResponse(user: MockUser, status = 200) {
  const session = issueSession(user);
  if (env.auth.refreshStrategy === 'cookie') {
    const {refreshToken, ...body} = session;
    return HttpResponse.json(body, {
      status,
      headers: {
        'Set-Cookie': `${REFRESH_COOKIE}=${refreshToken}; Path=/; SameSite=Strict`,
      },
    });
  }
  return HttpResponse.json(session, {status});
}

/** Resolves the caller from the Bearer token, mimicking an auth guard. */
export function authenticate(request: Request): MockUser | Response {
  const header = request.headers.get('Authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  const payload = token ? readAccessToken(token) : null;

  if (!payload) {
    return errorResponse(401, 'UNAUTHENTICATED', 'Bạn cần đăng nhập.');
  }
  if (payload.exp * 1000 <= Date.now()) {
    return errorResponse(401, 'TOKEN_EXPIRED', 'Access token đã hết hạn.');
  }
  const user = db.users.find((candidate) => candidate.id === payload.sub);
  return user ?? errorResponse(401, 'UNAUTHENTICATED', 'Tài khoản không tồn tại.');
}

export async function fileToDataUrl(file: File): Promise<string> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = '';
  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }
  return `data:${file.type || 'application/octet-stream'};base64,${btoa(binary)}`;
}

export function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}
