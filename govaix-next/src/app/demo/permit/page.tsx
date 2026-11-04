'use client';

import { useState } from 'react';
import { translate } from '@/lib/services/lingo';
import { enrichCompany } from '@/lib/services/crustData';
import { generateComplianceCode } from '@/lib/services/randomLabs';
import { isStubMode } from '@/lib/config/env';
import type { CompanyEnrichment, ComplianceCode, Translation } from '@/lib/services/types';
import { Home, ArrowRight, Globe, Code, Download, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function PermitDemo() {
  const [formData, setFormData] = useState<{
    language: 'ja' | 'en';
    businessType: string;
    address: string;
    businessName: string;
  }>({
    language: 'ja',
    businessType: 'restaurant',
    address: '',
    businessName: ''
  });
  const [userText, setUserText] = useState('');
  const [translation, setTranslation] = useState<Translation | null>(null);
  const [enrichment, setEnrichment] = useState<CompanyEnrichment | null>(null);
  const [complianceCode, setComplianceCode] = useState<ComplianceCode | null>(null);
  const [permit, setPermit] = useState<{ id: string; issuedAt: Date } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const targetLang = formData.language === 'ja' ? 'en' : 'ja';
  const canIssue = Boolean(complianceCode && formData.businessName.trim() && formData.address.trim());

  const updateField = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Changing permit details invalidates anything already generated from them.
    if (field !== 'language') {
      setComplianceCode(null);
      setPermit(null);
    }
    if (field === 'businessName') setEnrichment(null);
    if (field === 'language') setTranslation(null);
  };

  const run = async (label: string, fn: () => Promise<void>) => {
    setIsProcessing(true);
    setError(null);
    try {
      await fn();
    } catch (err) {
      console.error(`${label} error:`, err);
      setError(`${label} failed. Please try again.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTranslate = () =>
    userText.trim() && run('Translation', async () => setTranslation(await translate(userText, targetLang)));

  const handleEnrichCompany = () =>
    formData.businessName.trim() &&
    run('Company enrichment', async () => setEnrichment(await enrichCompany(formData.businessName)));

  const handleGenerateCode = () =>
    run('Code generation', async () =>
      setComplianceCode(await generateComplianceCode(`Permit for ${formData.businessType} at ${formData.address}`)),
    );

  const handleIssuePermit = () => {
    const id = `TKY-${Date.now().toString(36).toUpperCase()}`;
    setPermit({ id, issuedAt: new Date() });
  };

  const handleDownloadPermit = () => {
    if (!permit) return;
    const body = [
      'GovAIx Digital Permit (DEMO — not a valid government document)',
      '',
      `Permit ID: ${permit.id}`,
      `Business:  ${formData.businessName}`,
      `Type:      ${formData.businessType}`,
      `Address:   ${formData.address}`,
      `Issued:    ${permit.issuedAt.toISOString()}`,
      `Compliance level: ${complianceCode?.complianceLevel ?? 'n/a'}`,
    ].join('\n');
    const url = URL.createObjectURL(new Blob([body], { type: 'text/plain' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: `permit-${permit.id}.txt` });
    a.click();
    URL.revokeObjectURL(url);
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
          <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Multi-Language Permit Processing
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Process permits in multiple languages with AI-powered translation and compliance
              </p>
            </div>
            {isStubMode() && (
              <div className="self-start sm:self-auto shrink-0 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 px-3 py-1 rounded-full text-sm font-medium">
                (stubbed)
              </div>
            )}
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
                onChange={(e) => updateField('language', e.target.value as 'ja' | 'en')}
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
                onChange={(e) => updateField('businessType', e.target.value)}
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
                onChange={(e) => updateField('address', e.target.value)}
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
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                id="businessName"
                value={formData.businessName}
                onChange={(e) => updateField('businessName', e.target.value)}
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
            <div className="flex flex-col sm:flex-row gap-4">
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
                Translate to {targetLang === 'en' ? 'English' : 'Japanese'}
              </button>
            </div>
          </div>

          {error && (
            <div role="alert" className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 rounded-lg">
              {error}
            </div>
          )}

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
              title={!formData.address.trim() ? 'Enter a business address first' : undefined}
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
          {complianceCode && !permit && (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={handleIssuePermit}
                disabled={!canIssue}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center"
                aria-label="Issue digital permit"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Issue Digital Permit
              </button>
              {!canIssue && (
                <p className="text-sm text-gray-500 dark:text-gray-400">Enter a business name to issue the permit.</p>
              )}
            </div>
          )}

          {/* Digital Permit Card */}
          {permit && (
            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Digital Permit Issued
                  </h3>
                </div>
                <button
                  onClick={handleDownloadPermit}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg flex items-center"
                  aria-label="Download permit"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Permit ID:</span>
                  <p className="text-gray-600 dark:text-gray-400 font-mono">{permit.id}</p>
                </div>
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
                  <p className="text-gray-600 dark:text-gray-400">{permit.issuedAt.toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}