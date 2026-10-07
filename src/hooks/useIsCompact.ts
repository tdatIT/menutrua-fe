import {useMediaQuery} from '@astryxdesign/core/hooks';

/** Below the AppShell `md` breakpoint (768px): phone layouts. */
export function useIsCompact() {
  return !useMediaQuery('(min-width: 768px)');
}
