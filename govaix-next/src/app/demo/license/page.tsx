'use client';

import { useState } from 'react';
import { verifyBusiness } from '@/lib/services/crustData';
import { generateComplianceCode } from '@/lib/services/randomLabs';
import { routeToAgent } from '@/lib/services/dedalus';
import { Home, ArrowRight, CheckCircle, AlertCircle, Code } from 'lucide-react';
import Link from 'next/link';

export default function LicenseDemo() {
  const [formData, setFormData] = useState({
    businessName: '',
    registrationId: '',
    ownerEmail: ''
  });
  const [verification, setVerification] = useState<any>(null);
  const [complianceCode, setComplianceCode] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStubBadge, setShowStubBadge] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Verify business
      const verificationResult = await verifyBusiness(formData.businessName, formData.registrationId);
      setVerification(verificationResult);
      
      // Generate compliance code
      const codeResult = await generateComplianceCode(`Business license for ${formData.businessName}`);
      setComplianceCode(codeResult);
    } catch (error) {
      console.error('Error processing license application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitToDedalus = async () => {
    setIsSubmitting(true);
    try {
      const result = await routeToAgent('license', {
        businessName: formData.businessName,
        registrationId: formData.registrationId,
        ownerEmail: formData.ownerEmail,
        verification,
        complianceCode
      });
      alert('Application submitted to Dedalus successfully!');
    } catch (error) {
      console.error('Error submitting to Dedalus:', error);
    } finally {
      setIsSubmitting(false);
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
          <span className="text-gray-900 dark:text-white">Business License Demo</span>
        </nav>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Business License Application
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Experience automated business verification and compliance code generation
              </p>
            </div>
            {showStubBadge && (
              <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 px-3 py-1 rounded-full text-sm font-medium">
                (stubbed)
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                  aria-label="Business name"
                />
              </div>
              
              <div>
                <label htmlFor="registrationId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Registration ID
                </label>
                <input
                  type="text"
                  id="registrationId"
                  value={formData.registrationId}
                  onChange={(e) => setFormData({ ...formData, registrationId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                  aria-label="Registration ID"
                />
              </div>
            </div>

            <div>
              <label htmlFor="ownerEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Owner Email
              </label>
              <input
                type="email"
                id="ownerEmail"
                value={formData.ownerEmail}
                onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
                aria-label="Owner email address"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
              aria-label="Submit business license application"
            >
              {isSubmitting ? 'Processing...' : 'Verify Business'}
            </button>
          </form>

          {/* Verification Results */}
          {verification && (
            <div className="mb-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center mb-4">
                {verification.verified ? (
                  <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-yellow-600 mr-2" />
                )}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Business Verification: {verification.status}
                </h3>
                <span className="ml-auto text-sm text-gray-600 dark:text-gray-400">
                  Confidence: {verification.confidence}%
                </span>
              </div>
              
              {verification.details && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Registration Date:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {verification.details.registrationDate || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Status:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {verification.details.status}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Compliance Code */}
          {complianceCode && (
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Code className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Generated Compliance Code
                </h3>
                <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                  {complianceCode.language}
                </span>
              </div>
              
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">
                  <code>{complianceCode.code}</code>
                </pre>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {complianceCode.description}
              </p>
            </div>
          )}

          {/* Submit to Dedalus Button */}
          {verification && complianceCode && (
            <div className="flex justify-center">
              <button
                onClick={handleSubmitToDedalus}
                disabled={isSubmitting}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center"
                aria-label="Submit application to Dedalus"
              >
                Submit to Dedalus
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}