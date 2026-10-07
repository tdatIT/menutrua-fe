import {setupWorker} from 'msw/browser';
import {resetMockDb} from './db';
import {authHandlers} from './handlers/auth';
import {dishHandlers} from './handlers/dishes';
import {pollHandlers} from './handlers/polls';
import {publicHandlers} from './handlers/public';

export const worker = setupWorker(
  ...authHandlers,
  ...publicHandlers,
  ...dishHandlers,
  ...pollHandlers,
);

export async function startMockServer() {
  await worker.start({
    // Assets, fonts, HMR… pass through untouched.
    onUnhandledFrame: 'bypass',
    serviceWorker: {url: `${import.meta.env.BASE_URL}mockServiceWorker.js`},
    quiet: !import.meta.env.DEV,
  });
  Object.assign(window, {resetMockDb});
  console.info(
    '%c[MSW] Mock API on. Demo account: demo / menutrua123 — resetMockDb() to wipe data.',
    'color:#F25C05',
  );
}
