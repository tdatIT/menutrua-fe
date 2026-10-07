import {http, HttpResponse} from 'msw';
import {endpoints} from '@/lib/http/endpoints';
import {db, newId, persist, seedUserData, type MockUser} from '../db';
import {
  api,
  authenticate,
  errorResponse,
  latency,
  publicUser,
  REFRESH_COOKIE,
  sessionResponse,
} from '../utils';

type Credentials = {username?: string; password?: string};

function readRefreshToken(body: {refreshToken?: string} | null, cookies: Record<string, string>) {
  return body?.refreshToken ?? cookies[REFRESH_COOKIE] ?? null;
}

export const authHandlers = [
  http.post(api(endpoints.auth.login), async ({request}) => {
    await latency();
    const {username = '', password = ''} = (await request.json()) as Credentials;
    const user = db.users.find(
      (candidate) => candidate.username.toLowerCase() === username.trim().toLowerCase(),
    );
    if (!user || user.password !== password) {
      return errorResponse(401, 'INVALID_CREDENTIALS', 'Sai tên đăng nhập hoặc mật khẩu.');
    }
    return sessionResponse(user);
  }),

  http.post(api(endpoints.auth.register), async ({request}) => {
    await latency();
    const {username = '', password = ''} = (await request.json()) as Credentials;
    const normalized = username.trim();

    if (db.users.some((user) => user.username.toLowerCase() === normalized.toLowerCase())) {
      return errorResponse(409, 'USERNAME_TAKEN', 'Tên đăng nhập đã có người dùng.', {
        username: 'Tên đăng nhập đã có người dùng.',
      });
    }
    if (password.length < 8) {
      return errorResponse(422, 'VALIDATION_ERROR', 'Dữ liệu không hợp lệ.', {
        password: 'Mật khẩu cần ít nhất 8 ký tự.',
      });
    }

    const user: MockUser = {
      id: newId(),
      username: normalized,
      password,
      displayName: normalized,
    };
    db.users.push(user);
    seedUserData(db, user);
    persist();
    return sessionResponse(user, 201);
  }),

  // Refresh token rotation: every refresh revokes the presented token.
  // Re-using a revoked token is treated as theft and kills all sessions.
  http.post(api(endpoints.auth.refresh), async ({request, cookies}) => {
    await latency();
    const body = (await request.json().catch(() => null)) as {refreshToken?: string} | null;
    const token = readRefreshToken(body, cookies);
    const record = token ? db.refreshTokens[token] : undefined;

    if (!token || !record || record.expiresAt <= Date.now()) {
      return errorResponse(401, 'INVALID_REFRESH_TOKEN', 'Phiên đăng nhập đã hết hạn.');
    }
    if (record.revoked) {
      Object.values(db.refreshTokens)
        .filter((entry) => entry.userId === record.userId)
        .forEach((entry) => {
          entry.revoked = true;
        });
      persist();
      return errorResponse(401, 'REFRESH_TOKEN_REUSED', 'Phiên đăng nhập không hợp lệ.');
    }

    const user = db.users.find((candidate) => candidate.id === record.userId);
    if (!user) {
      return errorResponse(401, 'INVALID_REFRESH_TOKEN', 'Phiên đăng nhập đã hết hạn.');
    }
    record.revoked = true;
    return sessionResponse(user);
  }),

  http.post(api(endpoints.auth.logout), async ({request, cookies}) => {
    await latency();
    const body = (await request.json().catch(() => null)) as {refreshToken?: string} | null;
    const token = readRefreshToken(body, cookies);
    if (token && db.refreshTokens[token]) {
      db.refreshTokens[token].revoked = true;
      persist();
    }
    return new HttpResponse(null, {
      status: 204,
      headers: {'Set-Cookie': `${REFRESH_COOKIE}=; Path=/; Max-Age=0`},
    });
  }),

  http.get(api(endpoints.auth.me), async ({request}) => {
    await latency();
    const user = authenticate(request);
    if (user instanceof Response) return user;
    return HttpResponse.json(publicUser(user));
  }),
];
