import { AudioData } from './types';

const SHISA_API_KEY = process.env.NEXT_PUBLIC_SHISA_API_KEY || 'mock-key';

export async function speechToText(audio: Blob): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock implementation - return Japanese text
  return "こんにちは、レストランの営業許可を申請したいのですが";
}

export async function textToSpeech(text: string, lang: string = 'ja'): Promise<AudioData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Mock implementation - return mock audio data
  return {
    text,
    audioUrl: `data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT`,
    duration: Math.ceil(text.length * 0.1), // Rough estimate
    language: lang
  };
}