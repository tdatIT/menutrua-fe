import {Navigate, Outlet, useLocation} from 'react-router';
import {PageSpinner} from '@/components/feedback/PageSpinner';
import {useSession} from '@/lib/auth/session-store';
import {loginWithRedirect, paths} from './paths';

/** Signed-in only. Waits for the silent refresh before deciding. */
export function RequireAuth() {
  const status = useSession((state) => state.status);
  const location = useLocation();

  if (status === 'unknown') return <PageSpinner label="Đang kiểm tra phiên đăng nhập…" />;
  if (status === 'anonymous') {
    return <Navigate to={loginWithRedirect(location.pathname + location.search)} replace />;
  }
  return <Outlet />;
}

/** Login/register: bounce signed-in users straight into the app. */
export function GuestOnly() {
  const status = useSession((state) => state.status);

  if (status === 'unknown') return <PageSpinner />;
  if (status === 'authenticated') return <Navigate to={paths.app.pick} replace />;
  return <Outlet />;
}
