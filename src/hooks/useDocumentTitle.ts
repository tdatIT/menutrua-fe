import {useEffect} from 'react';
import {env} from '@/config/env';

/** Sets `<title>` per page — SPA routes otherwise share one title. */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${env.appName}` : env.appName;
  }, [title]);
}
