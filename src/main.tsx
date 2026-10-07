import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {RouterProvider} from 'react-router';
import {AppProviders} from '@/app/AppProviders';
import {router} from '@/app/router/router';
import {bootstrapSession, startSessionScheduler} from '@/lib/auth/session';
import '@/styles/globals.css';

async function enableMocking() {
  // Read import.meta.env directly (not env.enableMock) so Vite inlines the
  // literal and the whole MSW chunk is dropped from builds with mocks off.
  if (import.meta.env.VITE_ENABLE_MOCK !== 'true') return;
  const {startMockServer} = await import('@/mocks/browser');
  await startMockServer();
}

async function start() {
  const root = document.getElementById('root');
  if (!root) throw new Error('Root element #root not found');

  await enableMocking();

  startSessionScheduler();
  // Fire-and-forget: public pages render immediately, guarded routes wait
  // for the status to leave 'unknown'.
  void bootstrapSession();

  createRoot(root).render(
    <StrictMode>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </StrictMode>,
  );
}

void start();
