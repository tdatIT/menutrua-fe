import {Suspense} from 'react';
import {AppShell} from '@astryxdesign/core/AppShell';
import {Outlet} from 'react-router';
import {PageSpinner} from '@/components/feedback/PageSpinner';
import {SiteHeader} from './SiteHeader';

/** Signed-in tool pages: full-viewport shell, regions scroll on their own. */
export function AppLayout() {
  return (
    <AppShell height="fill" variant="section" topNav={<SiteHeader />}>
      <Suspense fallback={<PageSpinner />}>
        <Outlet />
      </Suspense>
    </AppShell>
  );
}
