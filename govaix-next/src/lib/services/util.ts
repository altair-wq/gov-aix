export const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Small deterministic string hash (FNV-1a) so mocks give stable results per input. */
export function hashString(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Deterministic pseudo-random number in [0, 1) derived from a string seed. */
export function seededRandom(seed: string): number {
  return hashString(seed) / 0x100000000;
}
