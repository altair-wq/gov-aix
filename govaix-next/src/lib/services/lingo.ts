import { Translation } from './types';

const LINGO_API_KEY = process.env.NEXT_PUBLIC_LINGO_API_KEY || 'mock-key';

export async function translate(text: string, targetLang: string): Promise<Translation> {
  // Simulate translation with delay
  await new Promise(resolve => setTimeout(resolve, 80));
  
  const sourceLang = targetLang === 'ja' ? 'en' : 'ja';
  
  return {
    original: text,
    translated: `${text} (translated to ${targetLang})`,
    sourceLanguage: sourceLang,
    targetLanguage: targetLang
  };
}