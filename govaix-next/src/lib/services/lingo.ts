import { Translation } from './types';
import { delay } from './util';

// Canned translations for the demo phrases so the stubbed flow reads naturally.
const PHRASEBOOK: Array<{ ja: string; en: string }> = [
  {
    ja: 'こんにちは、レストランの営業許可を申請したいです。',
    en: 'Hello, I would like to apply for a restaurant business permit.',
  },
  {
    ja: 'こんにちは、レストランの営業許可を申請したいのですが',
    en: "Hello, I'd like to apply for a restaurant business permit.",
  },
  { ja: 'レストランの営業許可を申請したいです。', en: 'I want to apply for a restaurant permit.' },
];

const normalize = (s: string) => s.trim().replace(/[。.!！?？\s]+$/u, '').toLowerCase();

export async function translate(text: string, targetLang: 'en' | 'ja'): Promise<Translation> {
  await delay(80);

  const sourceLang = targetLang === 'ja' ? 'en' : 'ja';
  const key = normalize(text);
  const hit = PHRASEBOOK.find((p) => normalize(p[sourceLang]) === key);

  return {
    original: text,
    translated: hit ? hit[targetLang] : `[${targetLang.toUpperCase()}] ${text}`,
    sourceLanguage: sourceLang,
    targetLanguage: targetLang,
  };
}
