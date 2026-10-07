import {useEffect} from 'react';
import {useToast} from '@astryxdesign/core/Toast';
import {useQueryClient} from '@tanstack/react-query';
import {Outlet, ScrollRestoration, useLocation, useNavigate} from 'react-router';
import {onSessionEvent} from '@/lib/auth/session';
import {loginWithRedirect, paths} from './paths';

/**
 * Root route: reacts to session events raised outside React (refresh failed,
 * logout in another tab) by wiping private cache and redirecting.
 */
export function RootLayout() {
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  useEffect(
    () =>
      onSessionEvent((event) => {
        queryClient.clear();
        if (event === 'expired') {
          toast({
            body: 'Phiên đăng nhập đã hết hạn, bro đăng nhập lại nhé.',
            type: 'error',
            uniqueID: 'session-expired',
          });
          navigate(loginWithRedirect(location.pathname), {replace: true});
        } else if (location.pathname.startsWith(paths.app.root)) {
          navigate(paths.home, {replace: true});
        }
      }),
    [toast, navigate, location.pathname, queryClient],
  );

  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
}
