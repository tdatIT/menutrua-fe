import {http} from '@/lib/http/client';
import {endpoints} from '@/lib/http/endpoints';
import type {AuthSession, AuthUser} from '@/lib/auth/types';

export type LoginPayload = {username: string; password: string};
export type RegisterPayload = {username: string; password: string};

export const authApi = {
  login: (payload: LoginPayload) =>
    http.post<AuthSession>(endpoints.auth.login, payload).then((res) => res.data),

  register: (payload: RegisterPayload) =>
    http.post<AuthSession>(endpoints.auth.register, payload).then((res) => res.data),

  me: () => http.get<AuthUser>(endpoints.auth.me).then((res) => res.data),
};
