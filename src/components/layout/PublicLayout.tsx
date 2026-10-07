import {Suspense} from 'react';
import {AppShell} from '@astryxdesign/core/AppShell';
import {Outlet} from 'react-router';
import {PageSpinner} from '@/components/feedback/PageSpinner';
import {SiteFooter} from './SiteFooter';
import {SiteHeader} from './SiteHeader';

/** Marketing pages: page-level scroll with the dark footer. */
export function PublicLayout() {
  return (
    <AppShell height="auto" variant="surface" topNav={<SiteHeader />}>
      <Suspense fallback={<PageSpinner />}>
        <Outlet />
      </Suspense>
      <SiteFooter />
    </AppShell>
  );
}
