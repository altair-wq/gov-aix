'use client';

import { useState, useEffect, useRef } from 'react';
import { generateMockMetrics, generateMockAgentPerformance, seededRng } from '@/lib/services/mockData';
import { Home, ArrowRight, RefreshCw, TrendingUp, DollarSign, Globe, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  // The page is statically prerendered, so the first render must be
  // deterministic or React reports a hydration mismatch. Seed it, then let
  // refreshes use real randomness.
  const [metrics, setMetrics] = useState(() => generateMockMetrics(seededRng(2025)));
  const [agentPerformance, setAgentPerformance] = useState(() => generateMockAgentPerformance(seededRng(42)));
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refreshTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refreshData = () => {
    setMetrics(generateMockMetrics());
    setAgentPerformance(generateMockAgentPerformance());
    setLastUpdated(new Date());
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshTimeout.current = setTimeout(() => {
      refreshData();
      setIsRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    // Auto-refresh every 30 seconds
    const interval = setInterval(refreshData, 30000);
    return () => {
      clearInterval(interval);
      if (refreshTimeout.current) clearTimeout(refreshTimeout.current);
    };
  }, []);

  const metricCards = [
    {
      title: 'Speed Improvement',
      value: metrics.speedImprovement,
      unit: 'x',
      icon: TrendingUp,
      color: 'blue',
      target: 100,
      description: 'Faster than traditional processing'
    },
    {
      title: 'Cost Reduction',
      value: metrics.costReduction,
      unit: '%',
      icon: DollarSign,
      color: 'green',
      target: 75,
      description: 'Operational cost savings'
    },
    {
      title: 'Languages Served',
      value: metrics.languagesServed,
      unit: '',
      icon: Globe,
      color: 'purple',
      target: 20,
      description: 'Multi-language support'
    },
    {
      title: 'Agent Success Rate',
      value: metrics.agentSuccessRate,
      unit: '%',
      icon: CheckCircle,
      color: 'green',
      target: 95,
      description: 'AI agent performance'
    }
  ];

  // Full class names (not concatenated) so Tailwind can detect them.
  // Tailwind v4 dropped `bg-opacity-*`; use the `/10` alpha modifier instead.
  const colorClasses = {
    blue: { tint: 'bg-blue-500/10', icon: 'text-blue-600 dark:text-blue-400', bar: 'bg-blue-500' },
    green: { tint: 'bg-green-500/10', icon: 'text-green-600 dark:text-green-400', bar: 'bg-green-500' },
    purple: { tint: 'bg-purple-500/10', icon: 'text-purple-600 dark:text-purple-400', bar: 'bg-purple-500' },
  } as const;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link href="/" className="flex items-center hover:text-gray-700 dark:hover:text-gray-300">
            <Home className="h-4 w-4 mr-1" />
            Home
          </Link>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900 dark:text-white">Analytics Dashboard</span>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              GovAIx Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Real-time performance metrics and agent analytics
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4 inline mr-1" />
              Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'just now'}
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center"
              aria-label="Refresh dashboard data"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {metricCards.map((card) => {
            const Icon = card.icon;
            const colors = colorClasses[card.color as keyof typeof colorClasses];
            const progress = (card.value / card.target) * 100;
            const isTargetMet = card.value >= card.target;
            
            return (
              <div
                key={card.title}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${colors.tint}`}>
                    <Icon className={`h-6 w-6 ${colors.icon}`} />
                  </div>
                  {isTargetMet && (
                    <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium">
                      Target Met
                    </div>
                  )}
                </div>
                
                <div className="mb-2">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {card.value}{card.unit}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {card.title}
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${colors.bar}`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>
                
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Agent Performance Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Agent Performance Analytics
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400" suppressHydrationWarning>
              Today: {new Date().toLocaleDateString()}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Agent
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Avg Latency
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Success Rate
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Calls Today
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {agentPerformance.map((agent) => (
                  <tr key={agent.agent} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {agent.agent}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {agent.avgLatency}ms
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                          <div
                            className={`h-2 rounded-full ${
                              agent.successRate >= 95 ? 'bg-green-500' : 
                              agent.successRate >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${agent.successRate}%` }}
                          />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {agent.successRate}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {agent.callsToday}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${
                          agent.successRate >= 95 ? 'bg-green-500' : 
                          agent.successRate >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        <span className={`text-sm font-medium ${
                          agent.successRate >= 95 ? 'text-green-600 dark:text-green-400' : 
                          agent.successRate >= 85 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {agent.successRate >= 95 ? 'Excellent' : 
                           agent.successRate >= 85 ? 'Good' : 'Needs Attention'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>GovAIx Analytics Dashboard - Real-time government service performance metrics</p>
          <p className="mt-1">Data updates every 30 seconds automatically</p>
        </div>
      </div>
    </div>
  );
}