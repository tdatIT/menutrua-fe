type JwtPayload = {exp?: number; sub?: string};

function decodeBase64Url(segment: string): string {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/**
 * Reads the payload of a JWT without verifying it. Only used for scheduling
 * refreshes on the client — the backend stays the source of truth.
 */
export function decodeJwt(token: string): JwtPayload | null {
  const [, payload] = token.split('.');
  if (!payload) return null;
  try {
    return JSON.parse(decodeBase64Url(payload)) as JwtPayload;
  } catch {
    return null;
  }
}

/** Absolute expiry in ms, from the `exp` claim or the `expiresIn` fallback. */
export function resolveExpiry(token: string, expiresInSeconds: number): number {
  const exp = decodeJwt(token)?.exp;
  return exp ? exp * 1000 : Date.now() + expiresInSeconds * 1000;
}
