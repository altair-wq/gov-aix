// Environment variable types
interface EnvVars {
  DEDALUS_API_URL: string;
  RANDOM_LABS_API_KEY: string;
  CRUSTDATA_API_KEY: string;
  LINGO_API_KEY: string;
  SHISA_API_KEY: string;
}

export const env: EnvVars = {
  DEDALUS_API_URL: process.env.NEXT_PUBLIC_DEDALUS_API_URL || 'https://api.dedalus.mock',
  RANDOM_LABS_API_KEY: process.env.NEXT_PUBLIC_RANDOM_LABS_API_KEY || 'mock-key',
  CRUSTDATA_API_KEY: process.env.NEXT_PUBLIC_CRUSTDATA_API_KEY || 'mock-key',
  LINGO_API_KEY: process.env.NEXT_PUBLIC_LINGO_API_KEY || 'mock-key',
  SHISA_API_KEY: process.env.NEXT_PUBLIC_SHISA_API_KEY || 'mock-key'
};

export function isStubMode(): boolean {
  return !process.env.NEXT_PUBLIC_DEDALUS_API_URL;
}