import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useNavigate, useSearchParams} from 'react-router';
import {endSession, establishSession} from '@/lib/auth/session';
import {useSession} from '@/lib/auth/session-store';
import {paths} from '@/app/router/paths';
import {authApi} from './api';
import type {LoginValues, RegisterValues} from './schemas';

/** Only allow same-app relative redirects (prevents open redirects). */
function safeRedirect(target: string | null): string {
  return target && target.startsWith('/') && !target.startsWith('//') ? target : paths.app.pick;
}

function usePostAuthRedirect() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  return () => navigate(safeRedirect(params.get('redirect')), {replace: true});
}

export function useLogin() {
  const redirect = usePostAuthRedirect();
  return useMutation({
    mutationFn: ({username, password}: LoginValues) => authApi.login({username, password}),
    onSuccess: (session, {remember}) => {
      establishSession(session, remember);
      redirect();
    },
  });
}

export function useRegister() {
  const redirect = usePostAuthRedirect();
  return useMutation({
    mutationFn: ({username, password}: RegisterValues) => authApi.register({username, password}),
    onSuccess: (session) => {
      establishSession(session, true);
      redirect();
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: endSession,
    onSettled: () => {
      queryClient.clear();
      navigate(paths.home, {replace: true});
    },
  });
}

export function useCurrentUser() {
  return useSession((state) => state.user);
}

export function useIsAuthenticated() {
  return useSession((state) => state.status === 'authenticated');
}
