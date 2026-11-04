/**
 * Client-visible configuration.
 *
 * Only non-secret values may use the NEXT_PUBLIC_ prefix: anything with that
 * prefix is inlined into the browser bundle. When the real Random Labs,
 * CrustData, Lingo.dev and Shisa integrations are wired up, their API keys
 * must be read server-side (route handlers / server actions) without the
 * NEXT_PUBLIC_ prefix.
 */
export const env = {
  DEDALUS_API_URL: process.env.NEXT_PUBLIC_DEDALUS_API_URL ?? '',
} as const;

/** True while the demo runs against local mocks instead of live services. */
export function isStubMode(): boolean {
  return !env.DEDALUS_API_URL;
}
