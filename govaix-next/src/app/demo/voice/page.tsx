'use client';

import { useEffect, useRef, useState } from 'react';
import { translate } from '@/lib/services/lingo';
import { routeToAgent } from '@/lib/services/dedalus';
import { canSpeak, speak, speechToText, stopSpeaking, textToSpeech } from '@/lib/services/shisa';
import { isStubMode } from '@/lib/config/env';
import type { AudioData } from '@/lib/services/types';
import { Home, ArrowRight, Mic, Globe, Play, Send, Square } from 'lucide-react';
import Link from 'next/link';

export default function VoiceDemo() {
  const [japaneseText, setJapaneseText] = useState('');
  const [englishTranslation, setEnglishTranslation] = useState('');
  const [agentResponse, setAgentResponse] = useState<{ en: string; ja: string } | null>(null);
  const [audio, setAudio] = useState<AudioData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      stopSpeaking();
    };
  }, []);

  const simulateRecording = async () => {
    setIsRecording(true);
    setError(null);
    try {
      const transcript = await speechToText();
      if (mounted.current) setJapaneseText(transcript);
    } finally {
      if (mounted.current) setIsRecording(false);
    }
  };

  const handleProcess = async () => {
    if (!japaneseText.trim()) return;

    setIsProcessing(true);
    setError(null);
    setAgentResponse(null);
    setAudio(null);
    try {
      const translation = await translate(japaneseText, 'en');
      setEnglishTranslation(translation.translated);

      const agentResult = await routeToAgent('citizen-service', {
        originalText: japaneseText,
        translatedText: translation.translated,
        language: 'ja',
      });
      const reply = agentResult.data?.reply ?? { en: agentResult.message, ja: agentResult.message };
      setAgentResponse(reply);

      // Speak the reply back in the caller's language.
      setAudio(await textToSpeech(reply.ja, 'ja'));
    } catch (err) {
      console.error('Voice processing error:', err);
      setError('Something went wrong while processing the inquiry. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlay = async () => {
    if (!audio) return;
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    try {
      await speak(audio);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Playback failed.');
    } finally {
      if (mounted.current) setIsSpeaking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link href="/" className="flex items-center hover:text-gray-700 dark:hover:text-gray-300">
            <Home className="h-4 w-4 mr-1" />
            Home
          </Link>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900 dark:text-white">Voice Service Demo</span>
        </nav>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Voice-Based Service Inquiry
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Experience AI-powered voice interactions in Japanese with real-time translation
              </p>
            </div>
            {isStubMode() && (
              <div className="self-start sm:self-auto shrink-0 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 px-3 py-1 rounded-full text-sm font-medium">
                (stubbed)
              </div>
            )}
          </div>

          {/* Voice Recording Section */}
          <div className="mb-8 text-center">
            <button
              onClick={simulateRecording}
              disabled={isRecording}
              className={`px-8 py-6 rounded-full transition-all duration-300 flex flex-col items-center mx-auto ${
                isRecording 
                  ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white disabled:bg-gray-400`}
              aria-label={isRecording ? 'Recording in progress' : 'Start voice recording'}
              aria-live="polite"
            >
              <Mic className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium">
                {isRecording ? 'Recording...' : 'Click to Record'}
              </span>
              <span className="text-xs opacity-75 mt-1">
                (Simulated - Japanese speech)
              </span>
            </button>
          </div>

          {/* Japanese Text Input */}
          <div className="mb-8">
            <label htmlFor="japaneseText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Japanese Transcript
            </label>
            <textarea
              id="japaneseText"
              value={japaneseText}
              onChange={(e) => setJapaneseText(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows={3}
              placeholder="こんにちは、レストランの営業許可を申請したいです。"
              aria-label="Japanese text transcript"
            />
          </div>

          {/* Process Button */}
          <div className="mb-8 text-center">
            <button
              onClick={handleProcess}
              disabled={!japaneseText.trim() || isProcessing}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center mx-auto"
              aria-label="Process voice inquiry"
            >
              <Send className="h-4 w-4 mr-2" />
              {isProcessing ? 'Processing...' : 'Process Inquiry'}
            </button>
          </div>

          {error && (
            <div role="alert" className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 rounded-lg">
              {error}
            </div>
          )}

          {/* Translation Results */}
          {englishTranslation && (
            <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center mb-4">
                <Globe className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  English Translation
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {englishTranslation}
              </p>
            </div>
          )}

          {/* Agent Response */}
          {agentResponse && (
            <div className="mb-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg mr-3">
                  <div className="h-6 w-6 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">AI</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Agent Response
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-3" lang="ja">
                {agentResponse.ja}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {agentResponse.en}
              </p>
            </div>
          )}

          {/* Audio Response */}
          {audio && (
            <div className="mb-8 p-6 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <div className="flex items-center mb-4">
                <Play className="h-6 w-6 text-purple-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Japanese Audio Response
                </h3>
              </div>
              <div className="flex items-center justify-center">
                <button
                  onClick={handlePlay}
                  disabled={!canSpeak()}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center"
                  aria-label={isSpeaking ? 'Stop audio response' : 'Play Japanese audio response'}
                >
                  {isSpeaking ? <Square className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isSpeaking ? 'Stop' : `Play response (~${audio.duration}s)`}
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
                {canSpeak()
                  ? isStubMode()
                    ? 'Played with your browser’s speech engine (Shisa AI TTS in production)'
                    : 'AI-generated Japanese response using Shisa AI text-to-speech'
                  : 'Speech playback is not supported in this browser.'}
              </p>
            </div>
          )}

          {/* Demo Instructions */}
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              How to Use This Demo
            </h4>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                  1
                </div>
                <p>Click the record button to simulate Japanese speech input (or type directly in the text area)</p>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                  2
                </div>
                <p>Click &ldquo;Process Inquiry&rdquo; to translate the Japanese text and route to the citizen service agent</p>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                  3
                </div>
                <p>Press &ldquo;Play response&rdquo; to hear the AI-generated Japanese reply</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}