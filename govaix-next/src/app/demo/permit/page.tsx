'use client';

import { useState } from 'react';
import { translate } from '@/lib/services/lingo';
import { enrichCompany } from '@/lib/services/crustData';
import { generateComplianceCode } from '@/lib/services/randomLabs';
import { Home, ArrowRight, Globe, Code, Download, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function PermitDemo() {
  const [formData, setFormData] = useState({
    language: 'ja',
    businessType: 'restaurant',
    address: '',
    businessName: ''
  });
  const [userText, setUserText] = useState('');
  const [translation, setTranslation] = useState<any>(null);
  const [enrichment, setEnrichment] = useState<any>(null);
  const [complianceCode, setComplianceCode] = useState<any>(null);
  const [permitIssued, setPermitIssued] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTranslate = async () => {
    if (!userText.trim()) return;
    
    setIsProcessing(true);
    try {
      const result = await translate(userText, 'en');
      setTranslation(result);
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEnrichCompany = async () => {
    if (!formData.businessName.trim()) return;
    
    setIsProcessing(true);
    try {
      const result = await enrichCompany(formData.businessName);
      setEnrichment(result);
    } catch (error) {
      console.error('Company enrichment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateCode = async () => {
    setIsProcessing(true);
    try {
      const result = await generateComplianceCode(`Permit for ${formData.businessType} at ${formData.address}`);
      setComplianceCode(result);
    } catch (error) {
      console.error('Code generation error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleIssuePermit = () => {
    setPermitIssued(true);
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
          <span className="text-gray-900 dark:text-white">Multi-Language Permit Demo</span>
        </nav>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Multi-Language Permit Processing
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Process permits in multiple languages with AI-powered translation and compliance
              </p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 px-3 py-1 rounded-full text-sm font-medium">
              (stubbed)
            </div>
          </div>

          {/* Language and Business Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <select
                id="language"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                aria-label="Select language"
              >
                <option value="ja">日本語 (Japanese)</option>
                <option value="en">English</option>
              </select>
            </div>

            <div>
              <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Business Type
              </label>
              <select
                id="businessType"
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                aria-label="Select business type"
              >
                <option value="restaurant">Restaurant</option>
                <option value="retail">Retail Store</option>
                <option value="office">Office</option>
                <option value="warehouse">Warehouse</option>
              </select>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Address
              </label>
              <input
                type="text"
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter business address"
                aria-label="Business address"
              />
            </div>
          </div>

          {/* Business Name Input */}
          <div className="mb-8">
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Business Name
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                id="businessName"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter business name for enrichment"
                aria-label="Business name"
              />
              <button
                onClick={handleEnrichCompany}
                disabled={!formData.businessName.trim() || isProcessing}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center"
                aria-label="Enrich company data"
              >
                <Globe className="h-4 w-4 mr-2" />
                Enrich
              </button>
            </div>
          </div>

          {/* Translation Section */}
          <div className="mb-8">
            <label htmlFor="userText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              User Request (in {formData.language === 'ja' ? 'Japanese' : 'English'})
            </label>
            <div className="flex gap-4">
              <textarea
                id="userText"
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={3}
                placeholder={formData.language === 'ja' ? 'レストランの営業許可を申請したいです。' : 'I want to apply for a restaurant permit.'}
                aria-label="User request text"
              />
              <button
                onClick={handleTranslate}
                disabled={!userText.trim() || isProcessing}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center"
                aria-label="Translate text"
              >
                <Globe className="h-4 w-4 mr-2" />
                Translate
              </button>
            </div>
          </div>

          {/* Translation Results */}
          {translation && (
            <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center mb-4">
                <Globe className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Translation Result
                </h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Original:</strong> {translation.original}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Translated:</strong> {translation.translated}
                </p>
              </div>
            </div>
          )}

          {/* Company Enrichment Results */}
          {enrichment && (
            <div className="mb-8 p-6 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-purple-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Company Enrichment Data
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Industry:</span>
                  <p className="text-gray-600 dark:text-gray-400">{enrichment.industry}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Employees:</span>
                  <p className="text-gray-600 dark:text-gray-400">{enrichment.employeeCount}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Revenue:</span>
                  <p className="text-gray-600 dark:text-gray-400">{enrichment.annualRevenue}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Risk Level:</span>
                  <p className="text-gray-600 dark:text-gray-400">{enrichment.riskLevel}</p>
                </div>
              </div>
            </div>
          )}

          {/* Generate Compliance Code */}
          <div className="mb-8">
            <button
              onClick={handleGenerateCode}
              disabled={!formData.address.trim() || isProcessing}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center"
              aria-label="Generate compliance code"
            >
              <Code className="h-4 w-4 mr-2" />
              Generate Compliance Code
            </button>
          </div>

          {/* Compliance Code Results */}
          {complianceCode && (
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Code className="h-6 w-6 text-indigo-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Generated Compliance Code
                </h3>
              </div>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">
                  <code>{complianceCode.code}</code>
                </pre>
              </div>
            </div>
          )}

          {/* Issue Digital Permit */}
          {complianceCode && (
            <div className="flex justify-center">
              <button
                onClick={handleIssuePermit}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center"
                aria-label="Issue digital permit"
              >
                <Download className="h-4 w-4 mr-2" />
                Issue Digital Permit
              </button>
            </div>
          )}

          {/* Digital Permit Card */}
          {permitIssued && (
            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Digital Permit Issued
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">✓</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">QR Code</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Business:</span>
                  <p className="text-gray-600 dark:text-gray-400">{formData.businessName}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Type:</span>
                  <p className="text-gray-600 dark:text-gray-400 capitalize">{formData.businessType}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Address:</span>
                  <p className="text-gray-600 dark:text-gray-400">{formData.address}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Issued:</span>
                  <p className="text-gray-600 dark:text-gray-400">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}