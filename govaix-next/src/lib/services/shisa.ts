import { AudioData } from './types';
import { delay } from './util';

export async function speechToText(audio?: Blob): Promise<string> {
  void audio; // sent to Shisa ASR once the live integration is enabled
  await delay(800);
  return 'こんにちは、レストランの営業許可を申請したいのですが';
}

/**
 * Prepares a spoken response. In stub mode playback uses the browser's
 * Web Speech API (see `speak`) rather than a pre-rendered audio file.
 */
export async function textToSpeech(text: string, lang: string = 'ja'): Promise<AudioData> {
  await delay(300);
  const language = lang === 'ja' ? 'ja-JP' : lang === 'en' ? 'en-US' : lang;
  // Japanese speech runs ~8 characters/second; Latin scripts ~15.
  const rate = language.startsWith('ja') ? 8 : 15;
  return { text, language, duration: Math.max(1, Math.ceil(text.length / rate)) };
}

export function canSpeak(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/** Speak `audio` via the Web Speech API. Resolves when playback finishes. */
export function speak(audio: AudioData): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!canSpeak()) return reject(new Error('Speech synthesis is not supported in this browser.'));
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(audio.text);
    utterance.lang = audio.language;
    const voice = window.speechSynthesis.getVoices().find((v) => v.lang === audio.language);
    if (voice) utterance.voice = voice;
    utterance.onend = () => resolve();
    utterance.onerror = (e) => (e.error === 'canceled' || e.error === 'interrupted' ? resolve() : reject(new Error(e.error)));
    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking(): void {
  if (canSpeak()) window.speechSynthesis.cancel();
}
