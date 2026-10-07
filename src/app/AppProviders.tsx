import {lazy, Suspense, type ReactNode} from 'react';
import {InternationalizationProvider} from '@astryxdesign/core/i18n';
import {LinkProvider} from '@astryxdesign/core/Link';
import vi from '@astryxdesign/core/locales/vi-VN.json';
import {Theme} from '@astryxdesign/core/theme';
import {QueryClientProvider} from '@tanstack/react-query';
import {RouterLink} from '@/components/navigation/RouterLink';
import {queryClient} from '@/lib/query/query-client';
import {menutruaTheme} from '@/themes/menutrua/menutrua.js';

const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import('@tanstack/react-query-devtools').then((module) => ({
        default: module.ReactQueryDevtools,
      })),
    )
  : () => null;

export function AppProviders({children}: {children: ReactNode}) {
  return (
    <InternationalizationProvider locale="vi-VN" messages={{'vi-VN': vi}}>
      <Theme theme={menutruaTheme} mode="light">
        <QueryClientProvider client={queryClient}>
          <LinkProvider component={RouterLink}>{children}</LinkProvider>
          <Suspense>
            <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
          </Suspense>
        </QueryClientProvider>
      </Theme>
    </InternationalizationProvider>
  );
}
