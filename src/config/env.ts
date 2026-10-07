/**
 * Typed, validated access to build-time environment variables.
 * Import `env` instead of reading `import.meta.env` across the codebase.
 */

type RefreshStrategy = 'cookie' | 'body';

function toNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function toStrategy(value: string | undefined): RefreshStrategy {
  return value === 'body' ? 'body' : 'cookie';
}

export const env = {
  appName: import.meta.env.VITE_APP_NAME || 'MenuTrua',
  appEnv: import.meta.env.VITE_APP_ENV || import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  apiTimeout: toNumber(import.meta.env.VITE_API_TIMEOUT, 15_000),
  enableMock: import.meta.env.VITE_ENABLE_MOCK === 'true',
  auth: {
    refreshStrategy: toStrategy(import.meta.env.VITE_AUTH_REFRESH_STRATEGY),
    refreshLeewaySeconds: toNumber(import.meta.env.VITE_AUTH_REFRESH_LEEWAY, 30),
  },
  mock: {
    accessTokenTtl: toNumber(import.meta.env.VITE_MOCK_ACCESS_TOKEN_TTL, 60),
    refreshTokenTtl: toNumber(import.meta.env.VITE_MOCK_REFRESH_TOKEN_TTL, 7 * 24 * 3600),
    latencyMs: toNumber(import.meta.env.VITE_MOCK_LATENCY_MS, 400),
  },
} as const;
