import Navigation from '@/components/Navigation';
import DemoBuild from '@/components/DemoBuild';
import DemoScenarios from '@/components/DemoScenarios';
import { ArrowRight, Play, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            GovAIx
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Transforming government services with AI-powered multi-agent systems
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/demo/license"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <Play className="h-5 w-5 mr-2" />
              Start Demo
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-8 py-4 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors duration-200"
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              View Analytics
            </Link>
          </div>
        </div>
      </section>

      {/* Demo Build Section */}
      <DemoBuild />

      {/* Demo Scenarios Section */}
      <DemoScenarios />

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Government Services?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Experience the future of efficient, AI-powered government operations
          </p>
          <Link
            href="/demo/license"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Try the Demo
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
