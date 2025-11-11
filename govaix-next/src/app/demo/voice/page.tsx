'use client';

import { useState } from 'react';
import { translate } from '@/lib/services/lingo';
import { routeToAgent } from '@/lib/services/dedalus';
import { textToSpeech } from '@/lib/services/shisa';
import { Home, ArrowRight, Mic, Globe, Play, Send } from 'lucide-react';
import Link from 'next/link';

export default function VoiceDemo() {
  const [japaneseText, setJapaneseText] = useState('');
  const [englishTranslation, setEnglishTranslation] = useState('');
  const [agentResponse, setAgentResponse] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const simulateRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setJapaneseText('こんにちは、レストランの営業許可を申請したいです。');
      setIsRecording(false);
    }, 2000);
  };

  const handleProcess = async () => {
    if (!japaneseText.trim()) return;
    
    setIsProcessing(true);
    try {
      // Translate Japanese to English
      const translation = await translate(japaneseText, 'en');
      setEnglishTranslation(translation.translated);
      
      // Route to citizen service agent
      const agentResult = await routeToAgent('citizen-service', {
        originalText: japaneseText,
        translatedText: translation.translated,
        language: 'ja'
      });
      
      setAgentResponse(agentResult.message || 'Your restaurant permit application has been processed. Please provide your business registration details to proceed.');
      
      // Generate Japanese audio response
      const audioResult = await textToSpeech(agentResult.message || 'Your application has been processed successfully.', 'ja');
      setAudioUrl(audioResult.audioUrl);
    } catch (error) {
      console.error('Voice processing error:', error);
    } finally {
      setIsProcessing(false);
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Voice-Based Service Inquiry
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Experience AI-powered voice interactions in Japanese with real-time translation
              </p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 px-3 py-1 rounded-full text-sm font-medium">
              (stubbed)
            </div>
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
              aria-label="Start voice recording"
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
              <p className="text-gray-700 dark:text-gray-300">
                {agentResponse}
              </p>
            </div>
          )}

          {/* Audio Response */}
          {audioUrl && (
            <div className="mb-8 p-6 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <div className="flex items-center mb-4">
                <Play className="h-6 w-6 text-purple-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Japanese Audio Response
                </h3>
              </div>
              <div className="flex items-center justify-center">
                <audio
                  controls
                  src={audioUrl}
                  className="w-full max-w-md"
                  aria-label="Japanese audio response"
                >
                  Your browser does not support the audio element.
                </audio>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
                AI-generated Japanese response using Shisa AI text-to-speech
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
                <p>Click "Process Inquiry" to translate the Japanese text and route to the citizen service agent</p>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                  3
                </div>
                <p>Listen to the AI-generated Japanese audio response using the audio player</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}