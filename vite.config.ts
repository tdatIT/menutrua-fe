import {rmSync} from 'node:fs';
import {fileURLToPath, URL} from 'node:url';
import {defineConfig, loadEnv, type Plugin} from 'vite';
import react from '@vitejs/plugin-react';

/** Drops the MSW worker script from builds that do not mock the API. */
function stripMockWorker(enabled: boolean): Plugin {
  return {
    name: 'menutrua:strip-mock-worker',
    apply: 'build',
    closeBundle() {
      if (enabled) return;
      rmSync(fileURLToPath(new URL('./dist/mockServiceWorker.js', import.meta.url)), {force: true});
    },
  };
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  const useMock = env.VITE_ENABLE_MOCK === 'true';
  const proxyTarget = env.DEV_API_PROXY_TARGET;

  return {
    plugins: [react(), stripMockWorker(useMock)],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    optimizeDeps: {
      // Lazy routes and the conditional MSW import hide deps from the
      // default crawl; scanning all sources avoids "Outdated Optimize Dep"
      // reloads on a cold dev start.
      entries: ['index.html', 'src/**/*.{ts,tsx}'],
      include: ['msw/browser'],
    },
    server: {
      port: 5173,
      // When the real backend runs locally, forward /api to it so auth
      // cookies stay same-origin. Disabled while MSW mocks the API.
      proxy:
        !useMock && proxyTarget
          ? {'/api': {target: proxyTarget, changeOrigin: true}}
          : undefined,
    },
    preview: {
      port: 4173,
    },
    build: {
      sourcemap: mode !== 'production',
    },
  };
});
